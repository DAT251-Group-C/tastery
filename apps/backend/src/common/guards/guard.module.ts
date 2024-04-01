import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MembershipModule } from '../../app/membership/membership.module';
import { ProjectModule } from '../../app/project/project.module';
import appConfig from '../config/app-conf';
import { AuthGuard } from './auth/auth.guard';
import { MembershipRoleGuard } from './membership-role/membership-role.guard';

@Module({
  imports: [ConfigModule.forFeature(appConfig), MembershipModule, ProjectModule],
  providers: [AuthGuard, MembershipRoleGuard],
  exports: [AuthGuard, MembershipRoleGuard],
})
export class GuardModule {}
