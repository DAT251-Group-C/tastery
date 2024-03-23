import { Module } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [],
  providers: [OpenAIService, ConfigService],
  exports: [OpenAIService],
})
export class OpenAIModule {}
