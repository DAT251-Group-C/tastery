import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { TranslatorService } from './translator.service';
import { Public } from '../../common/decorators/public.decorator';


@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Translator')
@Controller('translator')
export class TranslatorController {
  constructor(private translatorService: TranslatorService) {}


  @Get('/test-translate')
  @ApiOkResponse({ type: String })
  @Public()
  public translate() {
    return this.translatorService.translateText('Chicken breasts');
  }
}
