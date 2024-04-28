import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import { IngredientUnit } from '../../common/models/ingredient.model';

describe('RecipeController', () => {
  let controller: RecipeController;
  let service: jest.Mocked<RecipeService>;

  beforeEach(async () => {
    const mockRecipeService = {
      getRecipes: jest.fn().mockImplementation(() => of([])),
      getRecipeById: jest.fn().mockImplementation((id: string) =>
        of({
          id,
          name: 'Test Recipe',
          description: 'Test Description',
          tags: ['Tag1', 'Tag2'],
          ingredients: [],
        }),
      ),
      createRecipe: jest.fn().mockImplementation((userId: string, dto: CreateRecipeDto) =>
        of({
          ...dto,
          id: '1',
          ingredients: dto.ingredients.map((ingredient, index) => ({
            ...ingredient,
            id: `ing-${index + 1}`,
          })),
        }),
      ),
      updateRecipe: jest.fn().mockImplementation(() => of(undefined)),
      deleteRecipe: jest.fn().mockImplementation(() => of({ affected: 1 })),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipeController],
      providers: [
        {
          provide: RecipeService,
          useValue: mockRecipeService,
        },
        {
          provide: AuthGuard,
          useValue: { canActivate: jest.fn(() => true) },
        },
      ],
    }).compile();

    controller = module.get<RecipeController>(RecipeController);
    service = module.get<RecipeService>(RecipeService) as jest.Mocked<RecipeService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('getRecipeById', () => {
    it('should get a single recipe by id', async () => {
      const result = await controller.getRecipeById('1');
      expect(result).toEqual({
        id: '1',
        name: 'Test Recipe',
        description: 'Test Description',
        tags: ['Tag1', 'Tag2'],
        ingredients: [],
      });
      expect(service.getRecipeById).toHaveBeenCalledWith('1');
    });
  });

  describe('createRecipe', () => {
    it('should create a recipe with ingredients', async () => {
      const createRecipeDto: CreateRecipeDto = {
        name: 'Test Recipe',
        description: 'Test Description',
        instructions: 'Test Instructions',
        tags: ['Tag1', 'Tag2'],
        ingredients: [
          {
            ean: '123456789',
            amount: 2,
            name: 'Ingredient 1',
            image: 'http://example.com/image.png',
            unit: IngredientUnit.KILOGRAM,
          },
        ],
      };

      const result = await controller.createRecipe('user-id', createRecipeDto);
      expect(result).toEqual(
        expect.objectContaining({
          id: '1',
          ingredients: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
            }),
          ]),
        }),
      );
      expect(service.createRecipe).toHaveBeenCalledWith('user-id', createRecipeDto);
    });
  });

  describe('updateRecipe', () => {
    it('should update a recipe with partial ingredient data', async () => {
      const updateRecipeDto: UpdateRecipeDto = {
        name: 'Updated Recipe',
        description: 'Updated Description',
        tags: ['Tag1', 'Tag2'],
        ingredients: [
          {
            ean: '987654321',
            amount: 1,
            name: 'Updated Ingredient 1',
            image: 'http://example.com/updated_image.png',
            unit: IngredientUnit.LITER,
          },
        ],
      };

      await controller.updateRecipe('1', updateRecipeDto);
      expect(service.updateRecipe).toHaveBeenCalledWith('1', updateRecipeDto);
    });
  });
});
