import { ApiProperty } from '@nestjs/swagger';
import { Project } from './project.model';
import { Credential } from './credential.model';

export class FullCredential extends Credential {
  @ApiProperty({ type: Project }) project: Project;
}
