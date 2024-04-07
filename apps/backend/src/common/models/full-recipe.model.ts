import { ApiProperty } from '@nestjs/swagger';
import Recipe from './recipe.model';
import { User } from './user.model';

export class FullRecipe extends Recipe {
  @ApiProperty({ type: User }) user: User;
}
