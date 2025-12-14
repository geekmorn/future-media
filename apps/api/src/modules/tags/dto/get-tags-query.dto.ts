import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

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
    default: 20,
    maximum: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  limit?: number = 20;
}
