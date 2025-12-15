import { ApiProperty } from '@nestjs/swagger';
import { TagDto } from '../../../common/dto';

export class TagsListResponseDto {
  @ApiProperty({ type: [TagDto] })
  items!: TagDto[];
}
