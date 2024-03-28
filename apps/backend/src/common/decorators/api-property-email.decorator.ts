import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export const ApiPropertyEmail = () =>
  applyDecorators(
    ApiProperty({
      type: String,
      format: 'email',
    }),
  );
