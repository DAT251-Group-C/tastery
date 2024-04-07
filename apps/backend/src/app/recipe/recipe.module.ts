import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from '../../common/config/app-conf';
import { GuardModule } from '../../common/guards/guard.module';
import { IngredientEntity, RecipeEntity } from '../../entities';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeEntity, IngredientEntity]), GuardModule, ConfigModule.forFeature(appConfig)],
  controllers: [RecipeController],
  providers: [RecipeService],
  exports: [RecipeService],
})
export class RecipeModule {}
