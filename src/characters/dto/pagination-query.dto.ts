import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @ApiProperty({
    required: false,
    type: Number,
    description: 'The maximum number of items to return',
  })
  @IsOptional()
  @IsPositive()
  limit: number;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'The maximum number of items to skip',
  })
  @IsOptional()
  @IsPositive()
  offset: number;
}
