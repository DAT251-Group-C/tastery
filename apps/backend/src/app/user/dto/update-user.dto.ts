import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsOptional, IsString, IsUrl, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ type: String })
  @Expose()
  @Type(() => String)
  @IsOptional()
  @IsString()
  @MinLength(1)
  @Matches(/^[a-zA-Z\u00C0-\u01BF\s'-]*[a-zA-Z\u00C0-\u01BF][a-zA-Z\u00C0-\u01BF\s'-]*$/, { message: 'Name includes invalid characters' })
  @MaxLength(255)
  public name: string;

  @ApiPropertyOptional({ type: String })
  @Expose()
  @Type(() => String)
  @IsOptional()
  @IsUrl()
  public avatar: string;
}
