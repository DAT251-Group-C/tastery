import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from '../../common/config/app-conf';
import { GuardModule } from '../../common/guards/guard.module';
import { MembershipEntity, OrganizationEntity, ProjectEntity } from '../../models';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrganizationEntity, ProjectEntity, MembershipEntity]),
    forwardRef(() => GuardModule),
    ConfigModule.forFeature(appConfig),
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
