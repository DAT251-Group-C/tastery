import { ApiProperty } from '@nestjs/swagger';
import { JSONSchema7 } from 'json-schema';
import { Project } from './project.model';

export class Tool {
  @ApiProperty() id: string;
  @ApiProperty() projectId: string;
  @ApiProperty() name: string;
  @ApiProperty() description: string;
  @ApiProperty() createdAt: string;
  @ApiProperty() updatedAt: string;
  @ApiProperty() parameters: Record<string, JSONSchema7>;
}

export class FullTool extends Tool {
  @ApiProperty({ type: Project }) project: Project;
}
