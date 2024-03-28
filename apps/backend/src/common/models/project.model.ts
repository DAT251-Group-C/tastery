import { ApiProperty } from '@nestjs/swagger';
import { Credential } from './credential.model';
import { Organization } from './organization.model';
import { Tool } from './tool.model';
import { ApiPropertyDateTime } from '../decorators/api-property-date-iso.decorator';
import { ApiPropertyUUID } from '../decorators/api-property-uuid.decorator';

export class Project {
  @ApiPropertyUUID() id: string;
  @ApiPropertyUUID() organizationId: string;
  @ApiProperty() name: string;
  @ApiPropertyDateTime() createdAt: string;
  @ApiPropertyDateTime() updatedAt: string;
}

export class FullProject extends Project {
  @ApiProperty({ type: Credential, isArray: true }) credentials: Credential[];
  @ApiProperty({ type: Tool, isArray: true }) tools: Tool[];
  @ApiProperty({ type: Organization }) organization: Organization;
}
