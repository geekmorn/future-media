import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { PostsService } from './posts.service';
import {
  CreatePostDto,
  UpdatePostDto,
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

  @Patch(':id')
  @ApiOperation({ summary: 'Update a post' })
  @ApiCookieAuth()
  @ApiParam({ name: 'id', description: 'Post ID', type: String })
  @ApiResponse({ status: 200, description: 'Post updated', type: PostResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiResponse({ status: 403, description: 'Not authorized to edit this post' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePostDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<PostResponseDto> {
    return this.postsService.update(id, dto, user.sub);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a post' })
  @ApiCookieAuth()
  @ApiParam({ name: 'id', description: 'Post ID', type: String })
  @ApiResponse({ status: 204, description: 'Post deleted' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiResponse({ status: 403, description: 'Not authorized to delete this post' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<void> {
    return this.postsService.delete(id, user.sub);
  }
}
