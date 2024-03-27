import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from '../config/app-conf';
import { EncryptionService } from './encryption.service';

@Module({
  imports: [ConfigModule.forFeature(appConfig)],
  controllers: [],
  providers: [EncryptionService],
  exports: [EncryptionService],
})
export class EncryptionModule {}
