import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsString, IsUUID, IsUrl, MaxLength, MinLength } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ type: String })
  @Expose()
  @Type(() => String)
  @IsString()
  @MinLength(1)
  @MaxLength(63)
  public name: string;

  @ApiProperty({ type: String })
  @Expose()
  @Type(() => String)
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  public description: string;

  @ApiProperty({ type: String, isArray: true, minItems: 1, format: 'hostname' })
  @Type(() => String)
  @ArrayNotEmpty()
  @IsArray()
  @IsUrl({ require_tld: false }, { each: true })
  public referrerUrls: string[];

  @ApiProperty({ type: String, format: 'uuid' })
  @Type(() => String)
  @IsUUID()
  public organizationId: string;
}
