import { ApiProperty } from '@nestjs/swagger';
import { Credential } from './credential.model';
import { Organization } from './organization.model';
import { Project } from './project.model';
import { Tool } from './tool.model';

export class FullProject extends Project {
  @ApiProperty({ type: Credential, isArray: true }) credentials: Credential[];
  @ApiProperty({ type: Tool, isArray: true }) tools: Tool[];
  @ApiProperty({ type: Organization }) organization: Organization;
}
