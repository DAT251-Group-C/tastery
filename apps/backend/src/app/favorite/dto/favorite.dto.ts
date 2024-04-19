// favorite.dto.ts
import { IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class GetFavoritesDto {
    @ApiPropertyOptional({ description: 'Page number', default: 1 })
    @IsInt()
    @Min(1)
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    page?: number = 1;

    @ApiPropertyOptional({ description: 'Number of items per page', default: 10 })
    @IsInt()
    @Min(1)
    @Max(50)
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    take?: number = 10;
}

export class CreateFavoriteDto {
    @IsString()
    recipeId: string;
}
