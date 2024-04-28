import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RecipeEntity, IngredientEntity, UserEntity } from '../../entities';
import { RecipeService } from './recipe.service';
import { EntityManager, Repository, SelectQueryBuilder, UpdateResult } from 'typeorm';
import { MockProxy, mock, mockClear } from 'jest-mock-extended';
import { PageOptionsDto, SortOrder } from '../../common/dto/page-options.dto';
import { Observable, of } from 'rxjs';
import { OpenAIService } from '../openai/openai.service';
import { PageDto } from '../../common/dto/page.dto';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { IngredientUnit } from '../../common/models/ingredient.model';
import { v4 as uuidv4 } from 'uuid';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-id'),
}));

describe('RecipeService', () => {
  let recipeService: RecipeService;
  const recipeRepository: MockProxy<Repository<RecipeEntity>> = mock<Repository<RecipeEntity>>();
  const ingredientRepository: Repository<IngredientEntity> = mock<Repository<IngredientEntity>>();
  const openaiService: MockProxy<OpenAIService> = mock<OpenAIService>();
  const mockEntityManager: MockProxy<EntityManager> = mock<EntityManager>();

  beforeEach(async () => {
    mockEntityManager.transaction.mockImplementation(async transactionalFn => {
      return transactionalFn;
    });

    recipeRepository.createQueryBuilder.mockReturnValue({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getCount: jest.fn().mockResolvedValue(1),
      getMany: jest.fn().mockResolvedValue([new RecipeEntity()]),
    } as unknown as SelectQueryBuilder<RecipeEntity>);

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        RecipeService,
        {
          provide: getRepositoryToken(RecipeEntity),
          useValue: recipeRepository,
        },
        {
          provide: getRepositoryToken(IngredientEntity),
          useValue: ingredientRepository,
        },
        {
          provide: OpenAIService,
          useValue: openaiService,
        },
        RecipeService,
      ],
    }).compile();

    recipeService = module.get<RecipeService>(RecipeService);
  });

  afterEach(() => {
    mockClear(recipeRepository);
    mockClear(ingredientRepository);
    mockClear(openaiService);
    mockClear(mockEntityManager);
  });

  it('should be defined', async () => {
    expect(recipeService).toBeDefined();
    expect(recipeRepository).toBeDefined();
    expect(ingredientRepository).toBeDefined();
  });

  describe('getRecipes', () => {
    it('getRecipes', done => {
      const pageOptionsDto: PageOptionsDto = {
        search: 'Chicken',
        take: 10,
        skip: 0,
        order: SortOrder.ASC,
        page: 1,
      };

      recipeService.getRecipes(pageOptionsDto).subscribe(response => {
        expect(response.meta.itemCount).toBe(1);
        expect(response.data.length).toBe(1);

        expect(recipeRepository.createQueryBuilder).toHaveBeenCalled();
        expect(recipeRepository.createQueryBuilder().leftJoinAndSelect).toHaveBeenCalledWith('recipe.ingredients', 'ingredient');
        done();
      });
    });
  });

  describe('createRecipe', () => {
    it('createRecipe', done => {
      const testUser: UserEntity = new UserEntity();
      testUser.id = 'test-id';

      const createRecipeDto: CreateRecipeDto = {
        name: 'Test Recipe',
        description: 'Test Description',
        instructions: 'Some instructions',
        ingredients: [
          {
            name: 'Sugar',
            amount: 2,
            unit: IngredientUnit.CUP,
            ean: '',
          },
        ],
        tags: ['Dessert', 'Sweet'],
      };

      const createdRecipe: RecipeEntity = {
        ...createRecipeDto,
        id: 'recipe-id',
        user: Promise.resolve(testUser),
        ingredients: [
          {
            name: 'Sugar',
            amount: 2,
            unit: IngredientUnit.CUP,
            recipeId: 'recipe-id',
            id: 'ingredient-id',
            ean: '',
            recipe: Promise.resolve<RecipeEntity>({} as RecipeEntity),
            createdAt: '',
            updatedAt: '',
          },
        ],
        createdAt: new Date().toISOString(),
        favorites: Promise.resolve([]),
        updatedAt: new Date().toISOString(),
        userId: 'test-id',
      };

      recipeRepository.create.mockReturnValue(createdRecipe);
      recipeRepository.save.mockResolvedValue(createdRecipe);

      recipeService.createRecipe(testUser.id, createRecipeDto).subscribe(result => {
        expect(result).toEqual(createdRecipe);
        expect(recipeRepository.create).toHaveBeenCalledWith({
          ...createRecipeDto,
          id: 'test-id',
          userId: testUser.id,
        });
        expect(recipeRepository.save).toHaveBeenCalledWith(createdRecipe);
        done();
      });
    });
  });

  describe('deleteRecipe', () => {
    it('deleteRecipe', done => {
      const recipeId = '123';
      recipeRepository.delete.mockResolvedValue({
        raw: null,
        affected: 1,
      });

      recipeService.deleteRecipe(recipeId).subscribe({
        next: result => {
          expect(result.affected).toBe(1);
          expect(recipeRepository.delete).toHaveBeenCalledWith({ id: recipeId });
          done();
        },
      });
    });
    it('deleteRecipe Excepetion', async () => {
      const recipeId = 'non-existent-id';
      recipeRepository.delete.mockResolvedValue({ affected: 0, raw: {} });

      try {
        await recipeService.deleteRecipe(recipeId).toPromise();
      } catch (error: any) {
        expect(error).toBeInstanceOf(ResourceNotFoundException);
        expect(error.message).toBe(`Recipe with id ${recipeId} not found`);
      }

      expect(recipeRepository.delete).toHaveBeenCalledWith({ id: recipeId });
    });
  });

  describe('getRecipesById', () => {
    it('getRecipesById', done => {
      const recipeId = '123';
      const expectedRecipe = new RecipeEntity();
      expectedRecipe.id = recipeId;
      expectedRecipe.name = 'Chocolate Cake';

      recipeRepository.findOne.mockResolvedValue(expectedRecipe);

      recipeService.getRecipeById(recipeId).subscribe({
        next: recipe => {
          expect(recipe).toEqual(expectedRecipe);
          expect(recipeRepository.findOne).toHaveBeenCalledWith({ where: { id: recipeId } });
          done();
        },
        error: done.fail,
      });
    });
    it('should throw an error when recipe not found', done => {
      const recipeId = 'non-existent-id';
      recipeRepository.findOne.mockResolvedValue(null);

      recipeService.getRecipeById(recipeId).subscribe({
        next: () => {
          done.fail('Expected method to throw an ResourceNotFoundException, but it did not.');
        },
        error: error => {
          expect(error).toBeInstanceOf(ResourceNotFoundException);
          expect(error.message).toBe('Recipe not found');
          done();
        },
      });
    });
  });
});
