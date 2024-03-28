import { ApiProperty } from '@nestjs/swagger';
import { ApiPropertyDateTime } from '../decorators/api-property-date-iso.decorator';
import { ApiPropertyEmail } from '../decorators/api-property-email.decorator';
import { ApiPropertyUUID } from '../decorators/api-property-uuid.decorator';

export class User {
  @ApiPropertyUUID() id: string;
  @ApiPropertyEmail() email: string;
  @ApiProperty({ type: String, example: 'John Doe' }) name: string;
  @ApiPropertyDateTime() createdAt: string;
  @ApiPropertyDateTime() updatedAt: string;
}
