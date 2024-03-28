import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RevokeInviteDto {
  @ApiProperty({ type: String })
  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @IsEmail()
  public email: string;
}
