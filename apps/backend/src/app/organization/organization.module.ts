import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuardModule } from '../../common/guards/guard.module';
import { MembershipEntity, OrganizationEntity } from '../../models';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { ConfigModule } from '@nestjs/config';
import appConfig from '../../common/config/app-conf';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrganizationEntity, MembershipEntity]),
    forwardRef(() => GuardModule),
    ConfigModule.forFeature(appConfig),
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
