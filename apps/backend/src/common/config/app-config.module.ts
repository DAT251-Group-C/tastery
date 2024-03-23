import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConf from './app-conf';
import { AppConfig } from './app-config';

@Module({
  imports: [ConfigModule.forFeature(appConf)],
  providers: [AppConfig],
  exports: [AppConfig],
})
export class AppConfigModule {}
