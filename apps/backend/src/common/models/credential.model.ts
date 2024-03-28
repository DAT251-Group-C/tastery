import { ApiProperty } from '@nestjs/swagger';
import { Project } from './project.model';
import { ApiPropertyDateTime } from '../decorators/api-property-date-iso.decorator';
import { ApiPropertyUUID } from '../decorators/api-property-uuid.decorator';

export class Credential {
  @ApiPropertyUUID() id: string;
  @ApiPropertyUUID() projectId: string;
  @ApiProperty() name: string;
  @ApiProperty({ type: String, isArray: true, minItems: 1, format: 'hostname' }) referrerUrls: string[];
  @ApiPropertyDateTime() createdAt: string;
  @ApiPropertyDateTime() updatedAt: string;
}

export class FullCredential extends Credential {
  @ApiProperty({ type: Project }) project: Project;
}
