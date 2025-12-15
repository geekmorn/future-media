import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { TagsService } from './tags.service';
import { GetTagsQueryDto, TagsListResponseDto } from './dto';
import { Public } from '../../common/decorators';
import { PAGINATION } from '../../common/constants';

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get tags with optional search' })
  @ApiQuery({ name: 'search', required: false, description: 'Search query' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: `Max tags (1-${PAGINATION.MAX_TAGS_LIMIT})`,
  })
  @ApiResponse({ status: 200, description: 'List of tags', type: TagsListResponseDto })
  findAll(@Query() query: GetTagsQueryDto): Promise<TagsListResponseDto> {
    return this.tagsService.findAll(query);
  }
}
