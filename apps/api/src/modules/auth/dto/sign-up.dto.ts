import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, Matches, IsNotEmpty } from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    description: 'Username (3-32 chars, Latin/digits/_/-)',
    example: 'john_doe',
    minLength: 3,
    maxLength: 32,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(32)
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'Name must contain only Latin letters, digits, underscores, and hyphens',
  })
  name!: string;

  @ApiProperty({
    description: 'Password (min 6 chars)',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}
