import { ApiProperty } from '@nestjs/swagger';
import { Project } from './project.model';
import { Membership } from './membership.model';
import { ApiPropertyDateTime } from '../decorators/api-property-date-iso.decorator';
import { ApiPropertyUUID } from '../decorators/api-property-uuid.decorator';

export class Organization {
  @ApiPropertyUUID() id: string;
  @ApiProperty() name: string;
  @ApiPropertyDateTime() createdAt: string;
  @ApiPropertyDateTime() updatedAt: string;
}

export class FullOrganization extends Organization {
  @ApiProperty({ type: Membership, isArray: true }) memberships: Membership[];
  @ApiProperty({ type: Project, isArray: true }) projects: Project[];
}
