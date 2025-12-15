import { ApiProperty } from '@nestjs/swagger';

export class TagDto {
  @ApiProperty({
    description: 'Tag ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id!: string;

  @ApiProperty({
    description: 'Tag name',
    example: 'technology',
  })
  name!: string;
}

