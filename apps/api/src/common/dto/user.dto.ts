import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description: 'User ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id!: string;

  @ApiProperty({
    description: 'User name',
    example: 'johndoe',
  })
  name!: string;
}

export class UserWithColorDto extends UserDto {
  @ApiProperty({
    description: 'User avatar color',
    example: '#6366f1',
  })
  color!: string;
}

