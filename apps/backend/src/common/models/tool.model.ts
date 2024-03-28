import { ApiProperty } from '@nestjs/swagger';
import { JSONSchema7 } from 'json-schema';
import { Project } from './project.model';
import { ApiPropertyDateTime } from '../decorators/api-property-date-iso.decorator';
import { ApiPropertyUUID } from '../decorators/api-property-uuid.decorator';

export class Tool {
  @ApiPropertyUUID() id: string;
  @ApiPropertyUUID() projectId: string;
  @ApiProperty() name: string;
  @ApiProperty() description: string;
  @ApiPropertyDateTime() createdAt: string;
  @ApiPropertyDateTime() updatedAt: string;
  @ApiProperty() parameters: Record<string, JSONSchema7>;
}

export class FullTool extends Tool {
  @ApiProperty({ type: Project }) project: Project;
}
