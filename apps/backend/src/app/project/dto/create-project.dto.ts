import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ type: String })
  @Expose()
  @Type(() => String)
  @IsString()
  @MinLength(1)
  @MaxLength(63)
  public name: string;
}
