import { ApiProperty } from '@nestjs/swagger';
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
import { IngredientUnit } from '../../../common/models/ingredient.model';

export class CreateIngredientDto {
  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  ean: string;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  amount: number;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsUrl()
  @IsOptional()
  image: string;

  @ApiProperty({ enum: IngredientUnit, enumName: 'ingredient_unit' })
  @IsEnum(IngredientUnit)
  unit: IngredientUnit;
}

export class CreateRecipeDto {
  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  description: string;

  @ApiProperty({ type: String, isArray: true })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({ type: CreateIngredientDto, isArray: true, minItems: 1 })
  @Type(() => CreateIngredientDto)
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  @IsArray()
  ingredients: CreateIngredientDto[];
}
