import { Test, TestingModule } from '@nestjs/testing';
import { RecipeController } from '../app/recipe/recipe.controller';
import { RecipeService } from '../app/recipe/recipe.service';
import { Recipe } from '../common/models'; // Adjust this import based on your actual model path
import { CreateRecipeDto, CreateIngredientDto } from '../app/recipe/dto/create-recipe.dto'; // Adjust imports based on your DTO paths
import { UpdateRecipeDto } from '../app/recipe/dto/update-recipe.dto'; // Adjust imports based on your DTO paths
import { IngredientUnit } from '../common/models/ingredient.model';
import { of } from 'rxjs';
import { AuthGuard } from '../common/guards/auth/auth.guard';

describe('RecipeController', () => {
    let controller: RecipeController;
    let service: jest.Mocked<RecipeService>;

    beforeEach(async () => {
        const mockRecipeService = {
          getRecipes: jest.fn().mockImplementation(() => of([
            // Your mock implementation
          ])),
          getRecipeById: jest.fn().mockImplementation((id: string) => of({
            id: '1',
            name: 'Test Recipe',
            description: 'Test Description',
            tags: ['Tag1', 'Tag2'],
            ingredients: [],
          })),
          createRecipe: jest.fn().mockImplementation((userId: string, dto: CreateRecipeDto) => of({
            ...dto,
            id: '1',
            ingredients: dto.ingredients.map((ingredient, index) => ({
              ...ingredient,
              id: `ing-${index + 1}`,
            })),
          })),
          updateRecipe: jest.fn().mockImplementation(() => of(undefined)),
          deleteRecipe: jest.fn().mockImplementation(() => of({ affected: 1 })),
        };
      
        const mockAuthGuard = {
          canActivate: jest.fn(() => of(true)),
        };
      
        const module: TestingModule = await Test.createTestingModule({
          controllers: [RecipeController],
          providers: [
            {
              provide: RecipeService,
              useValue: mockRecipeService,
            },
            // Mock any other services or guards your controller relies on
            {
              provide: AuthGuard,
              useValue: mockAuthGuard,
            },
            // If there are other guards or dependencies, mock them similarly
          ],
        }).compile();

    controller = module.get<RecipeController>(RecipeController);
    service = module.get<RecipeService>(RecipeService) as jest.Mocked<RecipeService>;
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

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
    

    it('should create a recipe with ingredients', async () => {
        const createRecipeDto: CreateRecipeDto = {
        name: 'Test Recipe',
        description: 'Test Description',
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
    
        // Directly await the Promise returned by the controller method
        const result = await controller.createRecipe('user-id', createRecipeDto);
        expect(result).toEqual(expect.objectContaining({
        id: '1',
        ingredients: expect.arrayContaining([
            expect.objectContaining({
            id: expect.any(String),
            }),
        ]),
        }));
        expect(service.createRecipe).toHaveBeenCalledWith('user-id', createRecipeDto);
    });
    

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
    
        // Just await the Promise returned by the controller method directly
        await controller.updateRecipe('1', updateRecipeDto);
        expect(service.updateRecipe).toHaveBeenCalledWith('1', updateRecipeDto);
    });
    

});
