import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    description: 'Username',
    example: 'john_doe',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'Password',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
