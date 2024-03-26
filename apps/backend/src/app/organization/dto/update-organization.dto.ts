import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateOrganizationDto {
  @ApiPropertyOptional({ type: String })
  @Expose()
  @Type(() => String)
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(63)
  public name: string;
}
