import { Observable } from 'rxjs';
import { KassalappService } from './kassalapp.service';
import {
    ClassSerializerInterceptor,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Query,
    UseInterceptors,
  } from '@nestjs/common';
  import { ApiTags } from '@nestjs/swagger';
  import { Public } from '../../common/decorators/public.decorator';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Kassalapp')
@Controller('kassalapp')
export class KassalappController {
  constructor(private readonly kassalappService: KassalappService) {}

  @Get('/search')
  @Public()
  public search() {
    return this.kassalappService.searchProducts("Beef sirloin");
  }
}
//const url = `${this.baseURL}/products?search=${encodeURIComponent(translatedText)}?sort=${encodeURIComponent("price_asc")}`;