import { ApiProperty } from '@nestjs/swagger';
import { MembershipRole } from '../../entities/membership.entity';
import { Organization } from './organization.model';
import { User } from './user.model';

export class Membership {
  @ApiProperty() organizationId: string;
  @ApiProperty() userId: string;
  @ApiProperty({ enum: MembershipRole }) role: MembershipRole;
  @ApiProperty() createdAt: string;
  @ApiProperty() updatedAt: string;
}

export class FullMembership extends Membership {
  @ApiProperty({ type: Organization }) organization: Organization;
  @ApiProperty({ type: User }) user: User;
}
