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
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { catchError, lastValueFrom, take } from 'rxjs';
import { DeleteResult } from 'typeorm';
import { ApiOkResponsePaginated } from '../../common/decorators/api-ok-response-paginated.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { UserId } from '../../common/decorators/user-id.decorator';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import { IsRecipeOwnerGuard } from '../../common/guards/is-recipe-owner/is-recipe-owner.guard';
import { Recipe } from '../../common/models';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { RecipeService } from './recipe.service';

@ApiTags('Recipes')
@Controller('recipes')
@UseInterceptors(ClassSerializerInterceptor)
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get()
  @Public()
  @ApiOkResponsePaginated(Recipe)
  public getRecipes(@Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<Recipe>> {
    return lastValueFrom(
      this.recipeService.getRecipes(pageOptionsDto).pipe(
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

  @Get(':recipeId')
  @Public()
  @ApiParam({ name: 'recipeId', format: 'uuid' })
  @ApiOkResponse({ type: Recipe })
  public getRecipeById(@Param('recipeId', new ParseUUIDPipe()) recipeId: string): Promise<Recipe> {
    return lastValueFrom(
      this.recipeService.getRecipeById(recipeId).pipe(
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

  @Post()
  @ApiBearerAuth()
  @ApiBody({ type: CreateRecipeDto })
  @ApiOkResponse({ type: Recipe })
  public createRecipe(@UserId() userId: string, @Body() body: CreateRecipeDto): Promise<Recipe> {
    return lastValueFrom(
      this.recipeService.createRecipe(userId, body).pipe(
        take(1),
        catchError(err => {
          throw new BadRequestException(err.message || err);
        }),
      ),
    );
  }

  @Patch(':recipeId')
  @ApiBearerAuth()
  @UseGuards(IsRecipeOwnerGuard)
  @ApiParam({ name: 'recipeId', format: 'uuid' })
  @ApiBody({ type: UpdateRecipeDto })
  @HttpCode(HttpStatus.NO_CONTENT)
  public updateRecipe(@Param('recipeId') recipeId: string, @Body() body: UpdateRecipeDto): Promise<void> {
    return lastValueFrom(
      this.recipeService.updateRecipe(recipeId, body).pipe(
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

  @Delete(':recipeId')
  @ApiBearerAuth()
  @UseGuards(IsRecipeOwnerGuard)
  @ApiParam({ name: 'recipeId', format: 'uuid' })
  @HttpCode(HttpStatus.NO_CONTENT)
  public deleteRecipe(@Param('recipeId') recipeId: string): Promise<DeleteResult> {
    return lastValueFrom(
      this.recipeService.deleteRecipe(recipeId).pipe(
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
