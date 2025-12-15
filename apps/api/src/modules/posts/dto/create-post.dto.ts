import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsArray,
  IsOptional,
  IsUUID,
  ArrayMaxSize,
  Validate,
} from 'class-validator';
import { TotalTagsLimitConstraint } from '../../../common/validators';
import { PAGINATION } from '../../../common/constants';

export class CreatePostDto {
  @ApiProperty({
    description: 'Post content (1-240 chars)',
    example: 'Hello, this is my first post!',
    minLength: 1,
    maxLength: 240,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(240)
  content!: string;

  @ApiPropertyOptional({
    description: 'Array of existing tag IDs',
    example: ['550e8400-e29b-41d4-a716-446655440000'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMaxSize(PAGINATION.MAX_TAGS_PER_POST)
  @Validate(TotalTagsLimitConstraint)
  tagIds?: string[];

  @ApiPropertyOptional({
    description: 'Array of new tag names to create (1-12 chars each)',
    example: ['tech', 'news'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(12, { each: true })
  @ArrayMaxSize(PAGINATION.MAX_TAGS_PER_POST)
  tagNames?: string[];
}
