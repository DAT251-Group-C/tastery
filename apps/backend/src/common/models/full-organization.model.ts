import { ApiProperty } from '@nestjs/swagger';
import { Membership } from './membership.model';
import { Organization } from './organization.model';
import { Project } from './project.model';

export class FullOrganization extends Organization {
  @ApiProperty({ type: Membership, isArray: true }) memberships: Membership[];
  @ApiProperty({ type: Project, isArray: true }) projects: Project[];
}
