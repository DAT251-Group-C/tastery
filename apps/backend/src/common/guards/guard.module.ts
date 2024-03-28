import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../../app/user/user.module';
import { AuthGuard } from './auth/auth.guard';
import appConfig from '../config/app-conf';
import { MembershipRoleGuard } from './membership-role/membership-role.guard';
import { MembershipModule } from '../../app/membership/membership.module';

@Module({
  imports: [forwardRef(() => UserModule), ConfigModule.forFeature(appConfig), forwardRef(() => MembershipModule)],
  providers: [AuthGuard, MembershipRoleGuard],
  exports: [AuthGuard, MembershipRoleGuard],
})
export class GuardModule {}
