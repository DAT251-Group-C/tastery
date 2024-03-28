import { ApiProperty } from '@nestjs/swagger';
import { Project } from './project.model';
import { Membership } from './membership.model';

export class Organization {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() createdAt: string;
  @ApiProperty() updatedAt: string;
}

export class FullOrganization extends Organization {
  @ApiProperty({ type: Membership, isArray: true }) memberships: Membership[];
  @ApiProperty({ type: Project, isArray: true }) projects: Project[];
}
