import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from '../../common/config/app-conf';
import { EncryptionModule } from '../../common/encrypt/encryption.module';
import { GuardModule } from '../../common/guards/guard.module';
import { InviteEntity, MembershipEntity } from '../../entities';
import { MembershipModule } from '../membership/membership.module';
import { OrganizationModule } from '../organization/organization.module';
import { InviteController } from './invite.controller';
import { InviteService } from './invite.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([InviteEntity, MembershipEntity]),
    GuardModule,
    OrganizationModule,
    MembershipModule,
    EncryptionModule,
    ConfigModule.forFeature(appConfig),
  ],
  controllers: [InviteController],
  providers: [InviteService],
  exports: [InviteService],
})
export class InviteModule {}