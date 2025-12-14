import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TagDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ example: 'technology' })
  name!: string;
}

export class PostResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ example: 'Hello, this is my first post!' })
  content!: string;

  @ApiProperty({ type: [TagDto] })
  tags!: TagDto[];

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  authorId!: string;

  @ApiProperty({ example: 'john_doe' })
  authorName!: string;

  @ApiProperty({ example: '#6366f1' })
  authorColor!: string;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  createdAt!: Date;
}

export class PostsListResponseDto {
  @ApiProperty({ type: [PostResponseDto] })
  items!: PostResponseDto[];

  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000' })
  nextCursor?: string;

  @ApiPropertyOptional({ example: 100 })
  total?: number;
}
