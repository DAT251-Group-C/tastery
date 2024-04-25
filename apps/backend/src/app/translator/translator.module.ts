import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from '../../common/config/app-conf';
import { TranslatorController } from './translator.controller';
import { TranslatorService } from './translator.service';
import 'tslib';

@Module({
    imports: [ConfigModule.forFeature(appConfig)],
    controllers: [TranslatorController],
    providers: [TranslatorService],
    exports: [TranslatorService], 
})
export class TranslatorModule {}
