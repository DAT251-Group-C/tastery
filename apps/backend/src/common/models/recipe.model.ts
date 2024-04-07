import { ApiProperty } from '@nestjs/swagger';
import { ApiPropertyDateTime } from '../decorators/api-property-date-iso.decorator';
import { ApiPropertyUUID } from '../decorators/api-property-uuid.decorator';
import { Ingredient } from './ingredient.model';

export default class Recipe {
  @ApiPropertyUUID() id: string;
  @ApiPropertyUUID() userId: string;
  @ApiProperty() name: string;
  @ApiProperty() description: string;
  @ApiProperty() instructions: string;
  @ApiProperty({ isArray: true, type: String }) tags: string[];
  @ApiProperty({ type: Ingredient, isArray: true }) ingredients: Ingredient[];
  @ApiPropertyDateTime() createdAt: string;
  @ApiPropertyDateTime() updatedAt: string;
}
