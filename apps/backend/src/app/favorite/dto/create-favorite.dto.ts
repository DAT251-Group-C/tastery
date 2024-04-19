import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';


export class CreateFavoriteDto {
  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  userId: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  recipeId: string;


}