import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export const ApiPropertyUUID = () =>
  applyDecorators(
    ApiProperty({
      type: String,
      format: 'uuid',
    }),
  );
