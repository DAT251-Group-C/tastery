import { ApiProperty } from '@nestjs/swagger';
import { ApiPropertyDateTime } from '../decorators/api-property-date-iso.decorator';
import { ApiPropertyUUID } from '../decorators/api-property-uuid.decorator';
import { Ingredient } from './ingredient.model';

export default class Favorite {
  @ApiPropertyUUID() id: string;
  @ApiPropertyUUID() userId: string;
  @ApiPropertyUUID() recipeId: string;
  @ApiPropertyDateTime() createdAt: string;
}
