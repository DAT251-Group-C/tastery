import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from '../../common/config/app-conf';
import { GuardModule } from '../../common/guards/guard.module';
import { FavoriteEntity, IngredientEntity, RecipeEntity } from '../../entities';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';
import { RecipeModule } from '../recipe/recipe.module';

@Module({
    imports: [
        forwardRef(() => RecipeModule), // Use forwardRef here if RecipeModule imports GuardModule
        TypeOrmModule.forFeature([FavoriteEntity, RecipeEntity, IngredientEntity]), 
        GuardModule,  // Ensure GuardModule doesn't import FavoriteModule back
        ConfigModule.forFeature(appConfig)
    ], 
    controllers: [FavoriteController],
    providers: [FavoriteService],
    exports: [FavoriteService],
})
export class FavoriteModule {}
  
