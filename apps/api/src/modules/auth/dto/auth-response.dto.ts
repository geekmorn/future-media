import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../../common/dto';

export class AuthResponseDto {
  @ApiProperty({ type: UserDto })
  user!: UserDto;
}

export class SuccessResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;
}
