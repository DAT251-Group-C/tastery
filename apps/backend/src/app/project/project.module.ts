import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from '../../common/config/app-conf';
import { GuardModule } from '../../common/guards/guard.module';
import { ProjectEntity } from '../../entities';
import { MembershipModule } from '../membership/membership.module';
import { OrganizationModule } from '../organization/organization.module';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
  imports: [
    GuardModule,
    MembershipModule,
    OrganizationModule,
    ConfigModule.forFeature(appConfig),
    TypeOrmModule.forFeature([ProjectEntity]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
