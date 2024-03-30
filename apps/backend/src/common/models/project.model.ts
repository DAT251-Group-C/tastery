import { ApiProperty } from '@nestjs/swagger';
import { ApiPropertyDateTime } from '../decorators/api-property-date-iso.decorator';
import { ApiPropertyUUID } from '../decorators/api-property-uuid.decorator';

export class Project {
  @ApiPropertyUUID() id: string;
  @ApiPropertyUUID() organizationId: string;
  @ApiProperty() name: string;
  @ApiProperty() description: string;
  @ApiPropertyDateTime() createdAt: string;
  @ApiPropertyDateTime() updatedAt: string;
}
