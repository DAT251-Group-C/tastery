import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import OpenAI from 'openai';
import appConfig from '../../common/config/app-conf';

@Injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor(@Inject(appConfig.KEY) config: ConfigType<typeof appConfig>) {
    this.openai = new OpenAI({
      apiKey: config.openai.apiKey,
      organization: config.openai.organization,
    });
  }

  public get(): OpenAI {
    return this.openai;
  }
}
