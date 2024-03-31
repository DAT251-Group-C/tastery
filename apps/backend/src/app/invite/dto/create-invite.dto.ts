import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsNotIn } from 'class-validator';
import { ApiPropertyEmail } from '../../../common/decorators/api-property-email.decorator';
import { MembershipRole } from '../../../common/models/membership.model';

export class CreateInviteDto {
  @ApiPropertyEmail()
  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @ApiProperty({ enum: MembershipRole, enumName: 'MembershipRole', example: MembershipRole.ADMIN })
  @IsNotEmpty()
  @IsEnum(MembershipRole)
  @IsNotIn([MembershipRole.OWNER])
  public role: MembershipRole;
}
