import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, combineLatest, from, map, of, switchMap, tap } from 'rxjs';
import { Brackets, DeleteResult, Repository } from 'typeorm';
import { v4 } from 'uuid';
import { PageMetaDto } from '../../common/dto/page-meta.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import { IngredientUnit } from '../../common/models/ingredient.model';
import { IngredientEntity, RecipeEntity } from '../../entities';
import { OpenAIService } from '../openai/openai.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(RecipeEntity)
    private readonly recipeRepository: Repository<RecipeEntity>,
    @InjectRepository(IngredientEntity)
    private readonly ingredientRepository: Repository<IngredientEntity>,
    private readonly openAiService: OpenAIService,
  ) {}

  public getRecipes(pageOptionsDto: PageOptionsDto): Observable<PageDto<RecipeEntity>> {
    const query = this.recipeRepository.createQueryBuilder('recipe');

    query.leftJoinAndSelect('recipe.ingredients', 'ingredient');

    if (pageOptionsDto.search && pageOptionsDto.search.trim() !== '') {
      const searchTerm = (pageOptionsDto.search.toLowerCase());
      const searchPattern = `%${searchTerm}%`;
      console.log(searchTerm, searchPattern);
      query.where('LOWER(recipe.name) LIKE :search', { search: searchPattern });
      query.orWhere('LOWER(recipe.tags) LIKE :search', { search: searchPattern });
    }

    query.orderBy('recipe.createdAt', pageOptionsDto.order);
    query.skip(pageOptionsDto.skip);
    query.take(pageOptionsDto.take);

    return combineLatest([query.getCount(), query.getMany()]).pipe(
      map(([itemCount, recipes]) => {
        const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
        return new PageDto(recipes, pageMetaDto);
      }),
    );
  }

  private capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  private generateSearchSubstrings(searchString: string): string[] {
    const terms = searchString.split(/\s+/);
    const substrings: string[] = [];
    terms.forEach(term => {
      for (let i = 1; i <= term.length; i++) {
        substrings.push(term.substring(0, i));
      }
    });
    return substrings;
  }

  private filterByLevenshtein(searchString: string, name: string, tags: string[]): boolean {
    return searchString.split(/\s+/).some(searchTerm =>
      this.levenshteinDistance(searchTerm, name.toLowerCase()) <= 2 ||
      tags.some(tag => this.levenshteinDistance(searchTerm, tag.toLowerCase()) <= 2)
    );
  }



  public getFavoriteRecipes(userId: string, pageOptionsDto: PageOptionsDto): Observable<PageDto<RecipeEntity>> {
    const query = this.recipeRepository.createQueryBuilder('recipe');

    query.leftJoinAndSelect('recipe.ingredients', 'ingredient');

    query.innerJoin('recipe.favorites', 'favorite', 'favorite.userId = :userId', { userId });

    if (pageOptionsDto.search) {
      query.where('recipe.name like :search', { search: `%${pageOptionsDto.search}%` });
      query.orWhere('recipe.tags like :search', { search: `%${pageOptionsDto.search}%` });
    }

    query.orderBy('recipe.createdAt', pageOptionsDto.order);
    query.skip(pageOptionsDto.skip);
    query.take(pageOptionsDto.take);

    return combineLatest([query.getCount(), query.getMany()]).pipe(
      map(([itemCount, recipes]) => {
        const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
        return new PageDto(recipes, pageMetaDto);
      }),
    );
  }

  public getRecipeById(id: string): Observable<RecipeEntity> {
    return from(this.recipeRepository.findOne({ where: { id } })).pipe(
      map(recipe => {
        if (!recipe) {
          throw new ResourceNotFoundException('Recipe not found');
        }

        return recipe;
      }),
    );
  }

  public createRecipe(userId: string, data: CreateRecipeDto): Observable<RecipeEntity> {
    const id = v4();
    const recipe = this.recipeRepository.create({
      ...data,
      userId,
      id,
    });

    recipe.ingredients = data.ingredients.map(ingredient => this.ingredientRepository.create({ ...ingredient, recipeId: recipe.id }));

    return from(this.recipeRepository.save(recipe));
  }

  public updateRecipe(id: string, data: UpdateRecipeDto): Observable<void> {
    const { ingredients, ...rest } = data;

    const manager = this.ingredientRepository.manager;

    return from(
      manager.transaction(async transactionalEntityManager => {
        await transactionalEntityManager.update(RecipeEntity, { id }, rest);

        if (ingredients) {
          const recipe = await transactionalEntityManager.findOneOrFail(RecipeEntity, { where: { id } });
          recipe.ingredients = ingredients.map(ingredient => this.ingredientRepository.create({ ...ingredient, recipeId: id }));
          await transactionalEntityManager.save(RecipeEntity, recipe);
        }
      }),
    );
  }

  public deleteRecipe(id: string): Observable<DeleteResult> {
    return from(this.recipeRepository.delete({ id })).pipe(
      tap((result: DeleteResult) => {
        if (result.affected === 0) {
          throw new ResourceNotFoundException(`Recipe with id ${id} not found`);
        }
      }),
    );
  }

  private func = {
    name: 'create_recipe',
    description: 'Will create a recipe based on the provided parameters',
    parameters: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'The name of the recipe',
          minLength: 1,
          maxLength: 255,
        },
        description: {
          type: 'string',
          description: 'The description of the recipe',
          minLength: 1,
          maxLength: 255,
        },
        instructions: {
          type: 'string',
          description: 'Full instructions on how to prepare the recipe from start to finish',
          minLength: 1,
          maxLength: 2083,
        },
        tags: {
          type: 'array',
          description: 'Array of tags or categories describing the recipe. Should be human readable and capitalized',
          items: {
            type: 'string',
          },
        },
        ingredients: {
          type: 'array',
          description: 'Array of ingredients required to make the recipe',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'The name of the ingredient',
                minLength: 1,
                maxLength: 255,
              },
              amount: {
                type: 'number',
                description: 'The amount of the ingredient required',
              },
              unit: {
                enum: Object.values(IngredientUnit),
              },
            },
            required: ['name', 'amount', 'unit'],
          },
        },
      },
      required: ['name', 'description', 'instructions', 'tags', 'ingredients'],
    },
  };

  public createRandomRecipe(retry = 3): Observable<CreateRecipeDto> {
    const openai = this.openAiService.get();

    if (retry === -1) {
      throw new Error('Failed to generate a recipe');
    }

    return from(
      openai.chat.completions.create({
        model: 'gpt-3.5-turbo-1106',
        messages: [
          {
            role: 'system',
            content: `You are a cook that helps creating recipes for users. You figure things out without any further input or comments from the user.
            You are creative and can come up with new ideas for recipes. You can also provide suggestions for ingredients and cooking methods.
            You are explicit in your instructions and provide clear and concise information. You are also able to provide information on the nutritional value of the recipe.`,
          },
          {
            role: 'user',
            content:
              'Hello! Can you please create a recipe for me? I am looking for something new and exciting to try out. I am open to any suggestions. Make it interesting and unique! It can also be a classic.',
          },
        ],
        tools: [
          {
            type: 'function',
            function: this.func,
          },
        ],
      }),
    ).pipe(
      switchMap(response => {
        if (response.choices[0].finish_reason === 'tool_calls') {
          const data = response.choices[0].message.tool_calls?.[0];

          if (!data) {
            return this.createRandomRecipe(retry - 1);
          }

          if (data.function.name !== 'create_recipe') {
            return this.createRandomRecipe(retry - 1);
          }

          return of(this.toRecipe(JSON.parse(data.function.arguments)));
        } else {
          return this.createRandomRecipe(retry - 1);
        }
      }),
    );
  }

  // eslint-disable-next-line
  private toRecipe(data: any): CreateRecipeDto {
    return data as CreateRecipeDto;
  }

  private levenshteinDistance(s1: string, s2: string): number {
    const a = s1.length;
    const b = s2.length;
    const matrix = [];

    // Initialize the first row and column
    for (let i = 0; i <= a; i++) matrix[i] = [i];
    for (let j = 0; j <= b; j++) matrix[0][j] = j;

    // Compute the distances
    for (let i = 1; i <= a; i++) {
      for (let j = 1; j <= b; j++) {
        if (s1[i - 1] === s2[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j] + 1, // deletion
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j - 1] + 1 // substitution
          );
        }
      }
    }
    return matrix[a][b];
  }

  private isSimilar(searchTerm: string, target: string): boolean {
    const targetTerms = target.toLowerCase().split(/\s+/);
    return targetTerms.some(targetTerm => this.levenshteinDistance(searchTerm, targetTerm) <= 2);
  }
}
