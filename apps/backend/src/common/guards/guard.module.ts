import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from '../config/app-conf';
import { AuthGuard } from './auth/auth.guard';
import { RecipeModule } from '../../app/recipe/recipe.module';
import { IsRecipeOwnerGuard } from './is-recipe-owner/is-recipe-owner.guard';

@Module({
  imports: [ConfigModule.forFeature(appConfig), forwardRef(() => RecipeModule)],
  providers: [AuthGuard, IsRecipeOwnerGuard],
  exports: [AuthGuard, IsRecipeOwnerGuard],
})
export class GuardModule {}
