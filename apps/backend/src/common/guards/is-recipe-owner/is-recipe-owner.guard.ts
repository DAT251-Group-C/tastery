import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable, combineLatest, map } from 'rxjs';
import { RecipeService } from '../../../app/recipe/recipe.service';
import { RecipeEntity } from '../../../entities';
import { AuthGuard } from '../auth/auth.guard';

@Injectable()
export class IsRecipeOwnerGuard implements CanActivate {
  constructor(
    private authGuard: AuthGuard,
    private recipeService: RecipeService,
  ) {}

  public canActivate(context: ExecutionContext): Observable<boolean> {
    return combineLatest([this.getRecipe(context), this.authGuard.getAccessTokenFromRequest(context)]).pipe(
      map(([recipe, accessToken]) => {
        if (recipe.userId === accessToken.sub) {
          return true;
        }

        throw new ForbiddenException('You are not the owner of this recipe');
      }),
    );
  }

  private getRecipe(context: ExecutionContext): Observable<RecipeEntity> {
    const request = context.switchToHttp().getRequest();

    const recipeId = request.params['recipeId'];

    if (recipeId && typeof recipeId === 'string') {
      return this.recipeService.getRecipeById(recipeId);
    }

    throw new Error('Recipe ID was not found in request');
  }
}
