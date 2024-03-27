import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from '../../common/config/app-conf';
import { GuardModule } from '../../common/guards/guard.module';
import { ProjectEntity } from '../../models';
import { OrganizationModule } from '../organization/organization.module';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectEntity]),
    forwardRef(() => GuardModule),
    forwardRef(() => OrganizationModule),
    ConfigModule.forFeature(appConfig),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
