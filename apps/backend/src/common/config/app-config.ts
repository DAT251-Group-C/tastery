import { Injectable } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import appConfig from './app-conf';

@Injectable()
export class AppConfig {
  public config: ConfigType<typeof appConfig>;

  constructor(private configService: ConfigService) {
    const config = this.configService.get<ConfigType<typeof appConfig>>('appConfig');

    if (!config) {
      throw new Error('Config not found');
    }

    this.config = config;
  }
}
