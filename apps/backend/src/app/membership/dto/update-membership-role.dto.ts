import { ApiProperty } from '@nestjs/swagger';
import { MembershipRole } from '../../../common/models/membership.model';
import { IsEnum, IsUUID } from 'class-validator';
import { ApiPropertyUUID } from '../../../common/decorators/api-property-uuid.decorator';

export class UpdateMembershipRoleDto {
  @ApiProperty({ enum: MembershipRole, enumName: 'MembershipRole', example: MembershipRole.ADMIN })
  @IsEnum(MembershipRole)
  public role: MembershipRole;

  @ApiPropertyUUID()
  @IsUUID()
  public userId: string;
}
