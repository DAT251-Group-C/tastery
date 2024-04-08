import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from '../../common/config/app-conf';
import { OpenAIService } from './openai.service';

@Module({
  imports: [ConfigModule.forFeature(appConfig)],
  controllers: [],
  providers: [OpenAIService],
  exports: [OpenAIService],
})
export class OpenAIModule {}
