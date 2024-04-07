export enum IngredientUnit {
  GRAM = 'g',
  KILOGRAM = 'kg',
  MILLILITER = 'ml',
  LITER = 'l',
}

import { ApiProperty } from '@nestjs/swagger';
import { ApiPropertyDateTime } from '../decorators/api-property-date-iso.decorator';
import { ApiPropertyUUID } from '../decorators/api-property-uuid.decorator';

export class Ingredient {
  @ApiProperty({ type: String, example: '7039010019828' }) ean: string;
  @ApiProperty({ type: String, example: 'John Doe' }) name: string;
  @ApiProperty({ type: String }) image: string;
  @ApiPropertyUUID() recipeId: string;
  @ApiProperty({ type: Number }) amount: number;
  @ApiProperty({ enum: IngredientUnit, enumName: 'ingredient_unit' }) unit: IngredientUnit;
  @ApiPropertyDateTime() createdAt: string;
  @ApiPropertyDateTime() updatedAt: string;
}
