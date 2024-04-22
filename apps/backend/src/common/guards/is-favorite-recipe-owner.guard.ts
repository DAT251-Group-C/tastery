import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Observable, combineLatest, map } from 'rxjs';
import { RecipeService } from '../../app/recipe/recipe.service';
import { AuthGuard } from './auth/auth.guard';

@Injectable()
export class IsFavoriteRecipeOwnerGuard implements CanActivate {
  constructor(
    private authGuard: AuthGuard,
    private recipeService: RecipeService,
  ) {}

  canActivate(context: ExecutionContext): Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const recipeId = request.params.recipeId || request.body.recipeId;

    if (!recipeId) {
      throw new ForbiddenException('Recipe ID must be provided');
    }

    return combineLatest([this.recipeService.getRecipeById(recipeId), this.authGuard.getAccessTokenFromRequest(context)]).pipe(
      map(([recipe, accessToken]) => {
        if (!recipe) {
          throw new ForbiddenException('Recipe not found');
        }
        // Check if the user from the access token is the owner of the recipe
        if (recipe.userId === accessToken.sub) {
          return true;
        }
        throw new ForbiddenException('You are not the owner of this recipe');
      }),
    );
  }
}
