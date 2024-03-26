import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuardModule } from '../../common/guards/guard.module';
import { UserEntity } from '../../models';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import appConfig from '../../common/config/app-conf';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), forwardRef(() => GuardModule), ConfigModule.forFeature(appConfig)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
