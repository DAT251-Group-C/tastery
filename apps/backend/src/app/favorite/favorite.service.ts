import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { FavoriteEntity, IngredientEntity, RecipeEntity, UserEntity } from '../../entities';
import { Observable, catchError, combineLatest, from, map, of, switchMap, tap, throwError } from 'rxjs';
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
        return from(this.favoriteRepository.findOne({
            where: {
                user: { id: userId }, // Assuming there's a relation named 'user'
                recipe: { id: recipeId } // Assuming there's a relation named 'recipe'
            }
        })).pipe(
            switchMap((existingFavorite) => {
                if (existingFavorite) {
                    return throwError(() => new HttpException('Favorite already exists', HttpStatus.BAD_REQUEST));
                }
                const favorite = this.favoriteRepository.create({
                    user: { id: userId } as UserEntity,
                    recipe: { id: recipeId } as RecipeEntity
                });
                return from(this.favoriteRepository.save(favorite));
            }),
            catchError((error) => throwError(() => new HttpException('Failed to create favorite: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR)))
        );
    }
  
        


    deleteFavorite(userId: string, recipeId: string): Observable<DeleteResult> {
        // Attempt to delete the favorite based on both userId and recipeId
        return from(this.favoriteRepository.delete({ user: { id: userId }, recipe: { id: recipeId } })).pipe(
          tap((result: DeleteResult) => {
            if (result.affected === 0) {
              throw new ResourceNotFoundException(`Favorite for user ${userId} and recipe ${recipeId} not found`);
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

    public checkFavorite(userId: string, recipeId: string): Observable<boolean> {
        return from(this.favoriteRepository.findOne({
            where: {
                user: { id: userId },
                recipe: { id: recipeId }
            }
        })).pipe(
            map(favorite => !!favorite) // Convert the result to a boolean
        );
    }

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
