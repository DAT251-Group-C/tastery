import { ApiProperty } from '@nestjs/swagger';
import Favorite from './favorite.model';
import { User } from './user.model';
import Recipe from './recipe.model';

export class FullFavorite extends Favorite {
  @ApiProperty({ type: User }) user: User;
  @ApiProperty({ type: Recipe }) recipe: Recipe[];
}
