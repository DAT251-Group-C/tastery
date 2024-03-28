import { Expose, Type } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiPropertyEmail } from '../../../common/decorators/api-property-email.decorator';

export class RevokeInviteDto {
  @ApiPropertyEmail()
  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @IsEmail()
  public email: string;
}
