import { ApiProperty } from '@nestjs/swagger';
import { UserWithColorDto } from '../../../common/dto';

export class UsersListResponseDto {
  @ApiProperty({
    description: 'List of users',
    type: [UserWithColorDto],
  })
  items!: UserWithColorDto[];
}
