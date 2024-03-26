import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../../app/user/user.module';
import { AuthGuard } from './auth.guard';
import appConfig from '../config/app-conf';

@Module({
  imports: [forwardRef(() => UserModule), ConfigModule.forFeature(appConfig)],
  providers: [AuthGuard],
  exports: [AuthGuard],
})
export class GuardModule {}
