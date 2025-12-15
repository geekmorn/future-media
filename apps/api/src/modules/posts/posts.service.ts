import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity, TagEntity } from '../../entities';
import { TagsService } from '../tags/tags.service';
import { PAGINATION } from '../../common/constants';
import {
  CreatePostDto,
  UpdatePostDto,
  GetPostsQueryDto,
  PostResponseDto,
  PostsListResponseDto,
  SortOrder,
} from './dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    private readonly tagsService: TagsService,
  ) {}

  async create(dto: CreatePostDto, authorId: string): Promise<PostResponseDto> {
    const tags = await this.resolveTags(dto.tagIds, dto.tagNames);

    const post = this.postRepository.create({
      content: dto.content,
      authorId,
      tags,
    });

    await this.postRepository.save(post);

    const savedPost = await this.findOneWithRelations(post.id);
    if (!savedPost) {
      throw new NotFoundException('Post not found after creation');
    }

    return this.mapToResponse(savedPost);
  }

  async findAll(query: GetPostsQueryDto): Promise<PostsListResponseDto> {
    const {
      authorIds,
      tagIds,
      limit = PAGINATION.DEFAULT_LIMIT,
      cursor,
      sort = SortOrder.DESC,
    } = query;

    const qb = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.tags', 'tag')
      .orderBy('post.createdAt', sort === SortOrder.ASC ? 'ASC' : 'DESC')
      .take(limit + 1);

    if (cursor) {
      const cursorPost = await this.postRepository.findOne({ where: { id: cursor } });
      if (cursorPost) {
        const operator = sort === SortOrder.DESC ? '<' : '>';
        qb.andWhere(`post.createdAt ${operator} :cursorDate`, {
          cursorDate: cursorPost.createdAt,
        });
      }
    }

    if (authorIds?.length) {
      qb.andWhere('post.authorId IN (:...authorIds)', { authorIds });
    }

    if (tagIds?.length) {
      qb.andWhere((qb2) => {
        const subQuery = qb2
          .subQuery()
          .select('pt.postId')
          .from('posts_tags', 'pt')
          .where('pt.tagId IN (:...tagIds)')
          .getQuery();
        return `post.id IN ${subQuery}`;
      }).setParameter('tagIds', tagIds);
    }

    const posts = await qb.getMany();

    let nextCursor: string | undefined;
    if (posts.length > limit) {
      const lastPost = posts.pop();
      nextCursor = lastPost?.id;
    }

    return {
      items: posts.map((post) => this.mapToResponse(post)),
      nextCursor,
    };
  }

  async update(id: string, dto: UpdatePostDto, userId: string): Promise<PostResponseDto> {
    const post = await this.findOneWithRelations(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only edit your own posts');
    }

    if (dto.content !== undefined) {
      post.content = dto.content;
    }

    if (dto.tagIds !== undefined || dto.tagNames !== undefined) {
      post.tags = await this.resolveTags(dto.tagIds, dto.tagNames);
    }

    await this.postRepository.save(post);

    const updatedPost = await this.findOneWithRelations(id);
    if (!updatedPost) {
      throw new NotFoundException('Post not found after update');
    }

    return this.mapToResponse(updatedPost);
  }

  async delete(id: string, userId: string): Promise<void> {
    const post = await this.postRepository.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.postRepository.remove(post);
  }

  private async findOneWithRelations(id: string): Promise<PostEntity | null> {
    return this.postRepository.findOne({
      where: { id },
      relations: ['author', 'tags'],
    });
  }

  private async resolveTags(tagIds?: string[], tagNames?: string[]): Promise<TagEntity[]> {
    const tags: TagEntity[] = [];

    if (tagIds?.length) {
      const existingTags = await this.tagsService.findByIds(tagIds);
      if (existingTags.length !== tagIds.length) {
        throw new NotFoundException('Some tags not found');
      }
      tags.push(...existingTags);
    }

    if (tagNames?.length) {
      const createdTags = await this.tagsService.findOrCreateByNames(tagNames);
      for (const tag of createdTags) {
        if (!tags.some((t) => t.id === tag.id)) {
          tags.push(tag);
        }
      }
    }

    return tags;
  }

  private mapToResponse(post: PostEntity): PostResponseDto {
    return {
      id: post.id,
      content: post.content,
      tags: post.tags.map((tag) => ({ id: tag.id, name: tag.name })),
      authorId: post.author.id,
      authorName: post.author.name,
      authorColor: post.author.color,
      createdAt: post.createdAt,
    };
  }
}
