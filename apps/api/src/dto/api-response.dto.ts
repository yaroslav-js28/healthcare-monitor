import { Type } from '@nestjs/common';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';

export function ApiResponseDto<T>(
  DataDto: Type<T>,
  options?: { isArray: boolean }
) {
  class ApiResponseDtoClass {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ example: 'Success' })
    message: string;

    @ApiProperty({ example: new Date().toISOString() })
    timestamp: string;

    @ApiProperty({
      description: 'Response data',
      ...(options?.isArray
        ? {
            type: 'array',
            items: { $ref: getSchemaPath(DataDto) },
          }
        : { oneOf: [{ $ref: getSchemaPath(DataDto) }] }),
    })
    data: T | T[];
  }

  Object.defineProperty(ApiResponseDtoClass, 'name', {
    value: `ApiResponseDto_${DataDto.name}`,
  });

  return ApiResponseDtoClass;
}
