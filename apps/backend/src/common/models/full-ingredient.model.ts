import { ApiProperty } from '@nestjs/swagger';
import { Ingredient } from './ingredient.model';
import Recipe from './recipe.model';

export class FullIngredient extends Ingredient {
  @ApiProperty({ type: Recipe }) recipe: Recipe[];
}
