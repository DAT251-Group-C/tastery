import { ApiProperty } from '@nestjs/swagger';
import { ApiPropertyDateTime } from '../decorators/api-property-date-iso.decorator';
import { ApiPropertyUUID } from '../decorators/api-property-uuid.decorator';
import { ApiPropertyEmail } from '../decorators/api-property-email.decorator';

export class Invite {
  @ApiPropertyEmail() email: string;
  @ApiPropertyUUID() organizationId: string;
  @ApiPropertyDateTime() createdAt: string;
  @ApiPropertyDateTime() expiresAt: string;
  @ApiProperty() organizationName: string;
}
