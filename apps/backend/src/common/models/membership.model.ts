import { ApiProperty } from '@nestjs/swagger';
import { ApiPropertyDateTime } from '../decorators/api-property-date-iso.decorator';
import { ApiPropertyUUID } from '../decorators/api-property-uuid.decorator';

export enum MembershipRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  USER = 'user',
}

export class Membership {
  @ApiPropertyUUID() organizationId: string;
  @ApiPropertyUUID() userId: string;
  @ApiProperty({ enum: MembershipRole, enumName: 'MembershipRole' }) role: MembershipRole;
  @ApiPropertyDateTime() createdAt: string;
  @ApiPropertyDateTime() updatedAt: string;
}
