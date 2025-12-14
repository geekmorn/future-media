import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { PostsService } from './posts.service';
import {
  CreatePostDto,
  GetPostsQueryDto,
  PostResponseDto,
  PostsListResponseDto,
} from './dto';
import { Public, CurrentUser } from '../../common/decorators';
import type { JwtPayload } from '../../common/decorators';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get posts with optional filters' })
  @ApiQuery({ name: 'authorIds', required: false, description: 'Comma-separated author IDs' })
  @ApiQuery({ name: 'tagIds', required: false, description: 'Comma-separated tag IDs' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of posts (10-50)' })
  @ApiQuery({ name: 'cursor', required: false, description: 'Cursor for pagination' })
  @ApiQuery({ name: 'sort', required: false, enum: ['asc', 'desc'], description: 'Sort order' })
  @ApiResponse({ status: 200, description: 'List of posts', type: PostsListResponseDto })
  async findAll(@Query() query: GetPostsQueryDto): Promise<PostsListResponseDto> {
    return this.postsService.findAll(query);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiCookieAuth()
  @ApiResponse({ status: 201, description: 'Post created', type: PostResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiResponse({ status: 404, description: 'Some tags not found' })
  async create(
    @Body() dto: CreatePostDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<PostResponseDto> {
    return this.postsService.create(dto, user.sub);
  }
}
