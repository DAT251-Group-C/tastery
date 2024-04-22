import {
  BadRequestException,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { catchError, lastValueFrom, take } from 'rxjs';
import { DeleteResult } from 'typeorm';
import { UserId } from '../../common/decorators/user-id.decorator';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import Favorite from '../../common/models/favorite.model';
import { FavoriteEntity } from '../../entities';
import { FavoriteService } from './favorite.service';

@ApiTags('Favorites')
@Controller('favorites')
@UseInterceptors(ClassSerializerInterceptor)
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Get('check/:recipeId')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Returns true if the recipe is favorited by the user, false otherwise.' })
  checkFavorite(@UserId() userId: string, @Param('recipeId') recipeId: string): Promise<boolean> {
    return lastValueFrom(
      this.favoriteService.checkFavorite(userId, recipeId).pipe(
        take(1),
        catchError(err => {
          throw new BadRequestException(err.message || err);
        }),
      ),
    );
  }

  @Post(':recipeId')
  @ApiBearerAuth()
  @ApiOkResponse({ type: Favorite })
  createFavorite(@UserId() userId: string, @Param('recipeId') recipeId: string): Promise<FavoriteEntity> {
    return lastValueFrom(
      this.favoriteService.createFavorite(userId, recipeId).pipe(
        take(1),
        catchError(err => {
          throw new BadRequestException(err.message || err);
        }),
      ),
    );
  }

  @Delete(':recipeId')
  @ApiBearerAuth()
  @ApiParam({ name: 'recipeId', format: 'uuid' })
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteFavorite(@UserId() userId: string, @Param('recipeId') recipeId: string): Promise<DeleteResult> {
    return lastValueFrom(
      this.favoriteService.deleteFavorite(userId, recipeId).pipe(
        take(1),
        catchError(err => {
          if (err instanceof ResourceNotFoundException) {
            throw new NotFoundException(err.message);
          }

          throw new BadRequestException(err.message || err);
        }),
      ),
    );
  }
}
