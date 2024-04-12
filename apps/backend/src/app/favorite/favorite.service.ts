import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { FavoriteEntity, IngredientEntity, RecipeEntity, UserEntity } from '../../entities';
import { Observable, combineLatest, from, map, of, switchMap, tap } from 'rxjs';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import { PageDto } from '../../common/dto/page.dto';
import { PageMetaDto } from '../../common/dto/page-meta.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { v4 } from 'uuid';

@Injectable()
export class FavoriteService {
constructor(
        @InjectRepository(FavoriteEntity)
        private favoriteRepository: Repository<FavoriteEntity>,

        @InjectRepository(RecipeEntity)
    private readonly recipeRepository: Repository<RecipeEntity>,
    @InjectRepository(IngredientEntity)
    private readonly ingredientRepository: Repository<IngredientEntity>,
        // Include repositories for User and Recipe if necessary
    ) {}

/*     public createFavorite(userId: string, recipeId: string): Observable<FavoriteEntity> {
        const favorite = this.favoriteRepository.create({
            user: { id: userId }, 
            recipe: { id: recipeId },
        });
    
        return from(this.favoriteRepository.save(favorite));
    } */

    // favorite.service.ts

    public createFavorite(userId: string, recipeId: string): Observable<FavoriteEntity> {
        const favorite = new FavoriteEntity();
        favorite.user = { id: userId } as UserEntity; // This assumes you do not need the complete user entity
        favorite.recipe = { id: recipeId } as RecipeEntity; // This assumes you do not need the complete recipe entity
    
        return from(this.favoriteRepository.save(favorite));
    }
  
        


    public deleteFavorite(id: string): Observable<DeleteResult> {
        return from(this.favoriteRepository.delete({ id })).pipe(
          tap((result: DeleteResult) => {
            if (result.affected === 0) {
              throw new ResourceNotFoundException(`Favorite with id ${id} not found`);
            }
          }),
        );
      }
    

    

    
    public getUserFavorites(userId: string, pageOptionsDto: PageOptionsDto): Observable<PageDto<RecipeEntity>> {
        const query = this.favoriteRepository.createQueryBuilder('favorite')
            .leftJoinAndSelect('favorite.recipe', 'recipe') // Ensure there's a relation 'recipe' in Favorite entity
            .where('favorite.userId = :userId', { userId })
            // Optional: Implement search functionality if needed, similar to getRecipes
            .orderBy('recipe.createdAt', pageOptionsDto.order)
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take);
    
        return combineLatest([query.getCount(), query.getMany()]).pipe(
            map(([itemCount, favorites]) => {
                // Since favorites is an array of Favorite entities, we extract the recipe from each.
                const recipes = favorites.map(favorite => favorite.recipe);
                const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
                return new PageDto(recipes, pageMetaDto);
            }),
        );
    }
    

/*     public getUserFavorites(userId: string, pageOptionsDto: PageOptionsDto): Observable<PageDto<RecipeEntity>> {
        const queryBuilder = this.favoriteRepository.createQueryBuilder('favorite')
            .leftJoinAndSelect('favorite.recipe', 'recipe') // Assuming 'recipe' is correctly setup for lazy loading
            .where('favorite.userId = :userId', { userId })
            .orderBy('favorite.createdAt', pageOptionsDto.order)
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take);
    
        return from(queryBuilder.getManyAndCount()).pipe(
            switchMap(async ([favorites, itemCount]) => {
                const recipes = await Promise.all(favorites.map(async favorite => await favorite.recipe));
                const pageMetaDto = new PageMetaDto({
                    itemCount,
                    pageOptionsDto,
                });
                return new PageDto(recipes, pageMetaDto);
            }),
        );
    } */

    public getRecipeFavorites(recipeId: string, pageOptionsDto: PageOptionsDto): Observable<PageDto<UserEntity>> {
        const queryBuilder = this.favoriteRepository.createQueryBuilder('favorite')
            .leftJoinAndSelect('favorite.user', 'user')
            .where('favorite.recipeId = :recipeId', { recipeId })
            .orderBy('favorite.createdAt', pageOptionsDto.order)
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take);
    
        return from(queryBuilder.getManyAndCount()).pipe(
            map(([favorites, itemCount]) => {
                const users = favorites.map(favorite => favorite.user);
                const pageMetaDto = new PageMetaDto({
                    itemCount,
                    pageOptionsDto,
                });
                return new PageDto(users, pageMetaDto);
            }),
        );
    }
    
    
    
    
      
    
    
      
      

}
