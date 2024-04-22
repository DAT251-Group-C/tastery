import { ApiProperty } from '@nestjs/swagger';
import Recipe from './recipe.model';
import { User } from './user.model';
import Favorite from './favorite.model';
import { FavoriteEntity } from '../../entities';

export class FullRecipe extends Recipe {
  @ApiProperty({ type: User }) user: User;
  @ApiProperty({ type: Favorite, isArray: true }) favorites: FavoriteEntity[];
}
