import { ApiProperty } from '@nestjs/swagger';
import { Project } from './project.model';

export class Credential {
  @ApiProperty() id: string;
  @ApiProperty() projectId: string;
  @ApiProperty() name: string;
  @ApiProperty({ type: String, isArray: true, minItems: 1 }) referrerUrls: string[];
  @ApiProperty() createdAt: string;
  @ApiProperty() updatedAt: string;
}

export class FullCredential extends Credential {
  @ApiProperty({ type: Project }) project: Project;
}
