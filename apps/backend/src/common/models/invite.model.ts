import { ApiProperty } from '@nestjs/swagger';

export class Invite {
  @ApiProperty() email: string;
  @ApiProperty() organizationId: string;
  @ApiProperty() createdAt: string;
  @ApiProperty() expiresAt: string;
  @ApiProperty() organizationName: string;
}
