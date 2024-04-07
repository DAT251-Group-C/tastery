import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { CreateIngredientDto } from './create-recipe.dto';

export class UpdateRecipeDto {
  @ApiPropertyOptional({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(255)
  description?: string;

  @ApiPropertyOptional({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(2083)
  instructions?: string;

  @ApiPropertyOptional({ type: String, isArray: true })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ type: CreateIngredientDto, isArray: true, minItems: 1 })
  @Type(() => CreateIngredientDto)
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  @IsArray()
  @IsOptional()
  ingredients?: CreateIngredientDto[];
}
