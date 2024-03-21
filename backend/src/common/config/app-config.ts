import { ConfigService, ConfigType } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import appConfig from './app-conf';

@Injectable()
export class AppConfig {
  public config: ConfigType<typeof appConfig>;
  constructor(private configService: ConfigService) {
    this.config = this.configService.get<ConfigType<typeof appConfig>>('appConfig');
  }
}
