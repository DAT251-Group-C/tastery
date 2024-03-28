import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from '../../common/config/app-conf';
import { GuardModule } from '../../common/guards/guard.module';
import { MembershipEntity } from '../../entities';
import { MembershipController } from './membership.controller';
import { MembershipService } from './membership.service';
import { OrganizationModule } from '../organization/organization.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MembershipEntity]),
    forwardRef(() => GuardModule),
    OrganizationModule,
    ConfigModule.forFeature(appConfig),
  ],
  controllers: [MembershipController],
  providers: [MembershipService],
  exports: [MembershipService],
})
export class MembershipModule {}
