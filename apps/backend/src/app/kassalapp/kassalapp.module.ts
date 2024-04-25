import { Module } from '@nestjs/common';
import { KassalappService } from './kassalapp.service';
import { KassalappController } from './kassalapp.controller';
import { HttpModule } from '@nestjs/axios';
import { TranslatorModule } from '../translator/translator.module'; // Ensure this is the correct path
import appConfig from '../../common/config/app-conf';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, TranslatorModule, ConfigModule.forFeature(appConfig)],
  controllers: [KassalappController],
  providers: [KassalappService],
  exports: [KassalappService]
})
export class KassalappModule {}
