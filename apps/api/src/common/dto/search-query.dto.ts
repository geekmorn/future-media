import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { PAGINATION } from '../constants';

export class SearchQueryDto {
  @ApiPropertyOptional({
    description: 'Search query',
    example: 'search term',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Maximum number of items to return',
    example: PAGINATION.DEFAULT_LIMIT,
    default: PAGINATION.DEFAULT_LIMIT,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(PAGINATION.MAX_USERS_LIMIT)
  limit?: number = PAGINATION.DEFAULT_LIMIT;
}

