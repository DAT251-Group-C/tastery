import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from '../config/app-conf';
import { AuthGuard } from './auth/auth.guard';
import { RecipeModule } from '../../app/recipe/recipe.module';
import { IsRecipeOwnerGuard } from './is-recipe-owner/is-recipe-owner.guard';
import { IsFavoriteRecipeOwnerGuard } from './is-favorite-recipe-owner.guard'; // Make sure to import your new guard
import { FavoriteModule } from '../../app/favorite/favorite.module';

@Module({
  imports: [
    ConfigModule.forFeature(appConfig),
    forwardRef(() => RecipeModule), // Correct if RecipeModule imports GuardModule
  ],
  providers: [AuthGuard, IsRecipeOwnerGuard, IsFavoriteRecipeOwnerGuard],
  exports: [AuthGuard, IsRecipeOwnerGuard, IsFavoriteRecipeOwnerGuard],
})
export class GuardModule {}
