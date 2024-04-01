import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from '../../common/config/app-conf';
import { GuardModule } from '../../common/guards/guard.module';
import { CredentialEntity } from '../../entities';
import { CredentialController } from './credential.controller';
import { CredentialService } from './credential.service';
import { MembershipModule } from '../membership/membership.module';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [TypeOrmModule.forFeature([CredentialEntity]), GuardModule, MembershipModule, ProjectModule, ConfigModule.forFeature(appConfig)],
  controllers: [CredentialController],
  providers: [CredentialService],
  exports: [CredentialService],
})
export class CredentialModule {}
