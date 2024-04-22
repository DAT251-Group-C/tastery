import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, from, map, switchMap, tap, throwError } from 'rxjs';
import { DeleteResult, Repository } from 'typeorm';
import InvalidRequestException from '../../common/exceptions/invalid-request.exception';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import { FavoriteEntity } from '../../entities';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(FavoriteEntity)
    private favoriteRepository: Repository<FavoriteEntity>,
  ) {}

  public createFavorite(userId: string, recipeId: string): Observable<FavoriteEntity> {
    return from(this.checkFavorite(userId, recipeId)).pipe(
      switchMap(existingFavorite => {
        if (existingFavorite) {
          return throwError(() => new InvalidRequestException('Favorite already exists'));
        }

        return from(
          this.favoriteRepository.save(
            this.favoriteRepository.create({
              userId,
              recipeId,
            }),
          ),
        );
      }),
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

  public checkFavorite(userId: string, recipeId: string): Observable<boolean> {
    return from(
      this.favoriteRepository.findOne({
        where: {
          user: { id: userId },
          recipe: { id: recipeId },
        },
      }),
    ).pipe(
      map(favorite => !!favorite), // Convert the result to a boolean
    );
  }
}
