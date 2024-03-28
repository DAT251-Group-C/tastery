import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export const ApiPropertyDateTime = () =>
  applyDecorators(
    ApiProperty({
      type: String,
      format: 'date-time',
    }),
  );
