import {
    BadRequestException,
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    Post,
    Query,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { catchError, lastValueFrom, Observable, take } from 'rxjs';
import { PageOptionsDto } from '../../common/dto/page-options.dto'; // Update import paths as necessary
import { PageDto } from '../../common/dto/page.dto'; // Update import paths as necessary
import { FavoriteEntity, RecipeEntity } from '../../entities';
import { IsRecipeOwnerGuard } from '../../common/guards/is-recipe-owner/is-recipe-owner.guard';
import { FavoriteService } from './favorite.service';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import Favorite from '../../common/models/favorite.model';
import { UserId } from '../../common/decorators/user-id.decorator';
import { DeleteResult } from 'typeorm';
import { IsFavoriteRecipeOwnerGuard } from '../../common/guards/is-favorite-recipe-owner.guard';
import { ApiOkResponsePaginated } from '../../common/decorators/api-ok-response-paginated.decorator';
import { CreateFavoriteDto } from './dto/favorite.dto';


@ApiTags('Favorites')
@Controller('favorites')
@UseInterceptors(ClassSerializerInterceptor)
export class FavoriteController {
    constructor(private readonly favoriteService: FavoriteService) {}

    @Post()
    @ApiBearerAuth()
    @ApiBody({ type: CreateFavoriteDto })
    @ApiOkResponse({ type: Favorite })
    createFavorite(@UserId() userId: string, @Body() createFavoriteDto: CreateFavoriteDto): Observable<FavoriteEntity> {
        return this.favoriteService.createFavorite(userId, createFavoriteDto.recipeId);
    }
    

    @Delete(':recipeId')
    @ApiBearerAuth()
    @ApiParam({ name:'recipeId', format: 'uuid'})
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteFavorite( @UserId() userId: string, @Param('recipeId') recipeId: string): Promise<DeleteResult> {
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
        )
    }

    @Get()
    @ApiBearerAuth()
    @ApiOkResponsePaginated(Favorite)
    getFavorites( @UserId() userId: string, @Query() pageOptionsDto: PageOptionsDto): Observable<PageDto<RecipeEntity>> {
        return this.favoriteService.getUserFavorites(userId, pageOptionsDto);
    }

    @Get('check/:recipeId')
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Returns true if the recipe is favorited by the user, false otherwise.' })
    checkFavorite( @UserId() userId: string, @Param('recipeId') recipeId: string): Observable<boolean> {
        return this.favoriteService.checkFavorite(userId, recipeId);
    }

    


}
