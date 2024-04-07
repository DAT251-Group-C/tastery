import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, combineLatest, from, map, tap } from 'rxjs';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { v4 } from 'uuid';
import { PageMetaDto } from '../../common/dto/page-meta.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import { IngredientEntity, RecipeEntity } from '../../entities';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(RecipeEntity)
    private readonly recipeRepository: Repository<RecipeEntity>,
    @InjectRepository(IngredientEntity)
    private readonly ingredientRepository: Repository<IngredientEntity>,
  ) {}

  public getRecipes(pageOptionsDto: PageOptionsDto): Observable<PageDto<RecipeEntity>> {
    const query = this.recipeRepository.createQueryBuilder('recipe');

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

    const ingredients = data.ingredients.map(ingredient => {
      return this.ingredientRepository.create({
        ...ingredient,
        recipeId: id,
      });
    });

    const recipe = this.recipeRepository.create({
      id,
      userId,
      name: data.name,
      description: data.description,
      ingredients,
    });
    return from(this.recipeRepository.save(recipe));
  }

  public updateRecipe(id: string, data: UpdateRecipeDto): Observable<UpdateResult> {
    const dto = {
      ...data,
      ingredients: data.ingredients
        ? data.ingredients.map(ingredient => {
            return this.ingredientRepository.create({
              ...ingredient,
              recipeId: id,
            });
          })
        : undefined,
    };
    return from(this.recipeRepository.update({ id }, dto)).pipe(
      tap((result: UpdateResult) => {
        if (result.affected === 0) {
          throw new ResourceNotFoundException(`Recipe with id ${id} not found`);
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
}
