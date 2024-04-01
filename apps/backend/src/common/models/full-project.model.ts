import { ApiProperty } from '@nestjs/swagger';
import { Organization } from './organization.model';
import { Project } from './project.model';
import { Tool } from './tool.model';

export class FullProject extends Project {
  @ApiProperty({ type: Tool, isArray: true }) tools: Tool[];
  @ApiProperty({ type: Organization }) organization: Organization;
}
