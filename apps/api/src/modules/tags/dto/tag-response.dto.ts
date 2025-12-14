import { ApiProperty } from '@nestjs/swagger';

export class TagResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ example: 'technology' })
  name!: string;
}

export class TagsListResponseDto {
  @ApiProperty({ type: [TagResponseDto] })
  items!: TagResponseDto[];
}
