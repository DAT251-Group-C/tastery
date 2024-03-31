import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from '../config/app-conf';
import { EmailService } from './email.service';

@Module({
  imports: [ConfigModule.forFeature(appConfig)],
  controllers: [],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
