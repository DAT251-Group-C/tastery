import { ApiProperty } from '@nestjs/swagger';
import { FavoriteEntity } from '../../entities';
import Favorite from './favorite.model';
import { User } from './user.model';

export class FullUser extends User {
  @ApiProperty({ type: Favorite, isArray: true }) favorites: FavoriteEntity[];
}
