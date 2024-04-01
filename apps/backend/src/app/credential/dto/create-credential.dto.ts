import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class CreateCredentialDto {
  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @MinLength(1)
  @MaxLength(63)
  public name: string;

  @ApiProperty({ type: String, isArray: true, minItems: 1, format: 'hostname' })
  @Type(() => String)
  @ArrayNotEmpty()
  @IsArray()
  @IsUrl({}, { each: true })
  public referrerUrls: string[];
}
