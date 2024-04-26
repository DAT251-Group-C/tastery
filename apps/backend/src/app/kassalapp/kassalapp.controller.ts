import { Observable } from 'rxjs';
import { KassalappService } from './kassalapp.service';
import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Post,
    Query,
    UseInterceptors,
    Param,
  } from '@nestjs/common';
  import { ApiTags, ApiParam } from '@nestjs/swagger';
  import { Public } from '../../common/decorators/public.decorator';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Kassalapp')
@Controller('kassalapp')
export class KassalappController {
  constructor(private readonly kassalappService: KassalappService) {}

  @Get(':ingredient')
  @Public()
  @ApiParam({ name: 'ingredient' })
  public search(@Param('ingredient') ingredient: string) {
    return this.kassalappService.searchProducts(ingredient);
  }

  @Post('searchp')
  @Public()
  searchMultiple(): Observable<any[]> {
    const ingredients = ["Beef sirloin", "Chicken breasts", "Pork chops"];
    return this.kassalappService.searchBestPriceForProducts(ingredients);
  }

}
//const url = `${this.baseURL}/products?search=${encodeURIComponent(translatedText)}?sort=${encodeURIComponent("price_asc")}`;