import { ApiProperty } from '@nestjs/swagger';
import { Membership } from './membership.model';
import { Organization } from './organization.model';
import { Project } from './project.model';
import { User } from './user.model';

export class MembershipWithUser extends Membership {
  @ApiProperty({ type: User }) user: User;
}

export class FullOrganizationWithUsers extends Organization {
  @ApiProperty({ type: MembershipWithUser, isArray: true }) memberships: MembershipWithUser[];
  @ApiProperty({ type: Project, isArray: true }) projects: Project[];
}
