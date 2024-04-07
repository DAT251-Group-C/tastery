export enum IngredientUnit {
  GRAM = 'g',
  KILOGRAM = 'kg',
  MILLILITER = 'ml',
  LITER = 'l',
  PIECE = 'unit',
  TEASPOON = 'tsp',
  TABLESPOON = 'tbsp',
  CLOVE = 'clove',
  PINCH = 'pinch',
  SLICE = 'slice',
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApiPropertyDateTime } from '../decorators/api-property-date-iso.decorator';
import { ApiPropertyUUID } from '../decorators/api-property-uuid.decorator';

export class Ingredient {
  @ApiProperty({ type: String }) id: string;
  @ApiProperty({ type: String, example: '7039010019828' }) ean: string;
  @ApiProperty({ type: String, example: 'John Doe' }) name: string;
  @ApiPropertyOptional({ type: String, format: 'hostname' }) image?: string;
  @ApiPropertyUUID() recipeId: string;
  @ApiProperty({ type: Number }) amount: number;
  @ApiProperty({ enum: IngredientUnit, enumName: 'ingredient_unit' }) unit: IngredientUnit;
  @ApiPropertyDateTime() createdAt: string;
  @ApiPropertyDateTime() updatedAt: string;
}
