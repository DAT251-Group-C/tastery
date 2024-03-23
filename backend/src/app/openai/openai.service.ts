import { Injectable } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import OpenAI from 'openai';
import appConfig from '../../common/config/app-conf';

@Injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor(configService: ConfigService) {
    const config = configService.get<ConfigType<typeof appConfig>>('appConfig');

    if (!config) {
      throw new Error('Config not found');
    }

    this.openai = new OpenAI({
      apiKey: config.openai.apiKey,
      organization: config.openai.organization,
    });
  }

  public get(): OpenAI {
    return this.openai;
  }
}
