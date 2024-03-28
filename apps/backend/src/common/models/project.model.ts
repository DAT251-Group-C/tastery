import { ApiProperty } from '@nestjs/swagger';
import { Credential } from './credential.model';
import { Organization } from './organization.model';
import { Tool } from './tool.model';

export class Project {
  @ApiProperty() id: string;
  @ApiProperty() organizationId: string;
  @ApiProperty() name: string;
  @ApiProperty() createdAt: string;
  @ApiProperty() updatedAt: string;
}

export class FullProject extends Project {
  @ApiProperty({ type: Credential, isArray: true }) credentials: Credential[];
  @ApiProperty({ type: Tool, isArray: true }) tools: Tool[];
  @ApiProperty({ type: Organization }) organization: Organization;
}
