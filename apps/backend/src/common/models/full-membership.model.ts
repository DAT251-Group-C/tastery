import { ApiProperty } from '@nestjs/swagger';
import { Membership } from './membership.model';
import { Organization } from './organization.model';
import { User } from './user.model';

export class FullMembership extends Membership {
  @ApiProperty({ type: Organization }) organization: Organization;
  @ApiProperty({ type: User }) user: User;
}
