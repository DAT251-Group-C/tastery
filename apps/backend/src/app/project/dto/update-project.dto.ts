import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ArrayNotEmpty, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class UpdateProjectDto {
  @ApiPropertyOptional({ type: String })
  @Expose()
  @Type(() => String)
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(63)
  public name?: string;

  @ApiPropertyOptional({ type: String })
  @Expose()
  @Type(() => String)
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(63)
  public description?: string;

  @ApiProperty({ type: String, isArray: true, minItems: 1, format: 'hostname' })
  @Type(() => String)
  @ArrayNotEmpty()
  @IsOptional()
  @IsUrl({ require_tld: false }, { each: true })
  public referrerUrls: string[];
}
