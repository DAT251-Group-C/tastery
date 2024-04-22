import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from '../../common/config/app-conf';
import { GuardModule } from '../../common/guards/guard.module';
import { FavoriteEntity, IngredientEntity, RecipeEntity } from '../../entities';
import { RecipeModule } from '../recipe/recipe.module';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';

@Module({
  imports: [
    forwardRef(() => RecipeModule),
    TypeOrmModule.forFeature([FavoriteEntity, RecipeEntity, IngredientEntity]),
    GuardModule,
    ConfigModule.forFeature(appConfig),
  ],
  controllers: [FavoriteController],
  providers: [FavoriteService],
  exports: [FavoriteService],
})
export class FavoriteModule {}
