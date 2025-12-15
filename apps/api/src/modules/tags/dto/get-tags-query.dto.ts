import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { PAGINATION } from '../../../common/constants';

export class GetTagsQueryDto {
  @ApiPropertyOptional({
    description: 'Search query for tag names',
    example: 'tech',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Maximum number of tags to return',
    example: 10,
    default: PAGINATION.DEFAULT_LIMIT,
    maximum: PAGINATION.MAX_TAGS_LIMIT,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(PAGINATION.MAX_TAGS_LIMIT)
  limit?: number = PAGINATION.DEFAULT_LIMIT;
}
