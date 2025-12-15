import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, Max, IsEnum, IsUUID } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PAGINATION } from '../../../common/constants';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class GetPostsQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by author IDs (comma-separated)',
    example: '550e8400-e29b-41d4-a716-446655440000,660e8400-e29b-41d4-a716-446655440001',
  })
  @IsOptional()
  @Transform(({ value }: { value: string }) =>
    value ? value.split(',').filter(Boolean) : undefined,
  )
  @IsUUID('4', { each: true })
  authorIds?: string[];

  @ApiPropertyOptional({
    description: 'Filter by tag IDs (comma-separated)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @Transform(({ value }: { value: string }) =>
    value ? value.split(',').filter(Boolean) : undefined,
  )
  @IsUUID('4', { each: true })
  tagIds?: string[];

  @ApiPropertyOptional({
    description: `Number of posts to return (${PAGINATION.MIN_POSTS_LIMIT}-${PAGINATION.MAX_POSTS_LIMIT})`,
    example: PAGINATION.DEFAULT_LIMIT,
    default: PAGINATION.DEFAULT_LIMIT,
    minimum: PAGINATION.MIN_POSTS_LIMIT,
    maximum: PAGINATION.MAX_POSTS_LIMIT,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(PAGINATION.MIN_POSTS_LIMIT)
  @Max(PAGINATION.MAX_POSTS_LIMIT)
  limit?: number = PAGINATION.DEFAULT_LIMIT;

  @ApiPropertyOptional({
    description: 'Cursor for pagination (post ID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiPropertyOptional({
    description: 'Sort order by createdAt',
    enum: SortOrder,
    default: SortOrder.DESC,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sort?: SortOrder = SortOrder.DESC;
}
