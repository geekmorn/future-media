import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, ILike } from 'typeorm';
import { PostEntity, TagEntity } from '../../entities';
import {
  CreatePostDto,
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
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}

  async create(dto: CreatePostDto, authorId: string): Promise<PostResponseDto> {
    const tags: TagEntity[] = [];

    // Get existing tags by IDs
    if (dto.tagIds?.length) {
      const existingTags = await this.tagRepository.findBy({
        id: In(dto.tagIds),
      });

      if (existingTags.length !== dto.tagIds.length) {
        throw new NotFoundException('Some tags not found');
      }

      tags.push(...existingTags);
    }

    // Create or get tags by names
    if (dto.tagNames?.length) {
      for (const tagName of dto.tagNames) {
        const normalizedName = tagName.trim().toLowerCase();

        if (!normalizedName) continue;

        let tag = await this.tagRepository.findOne({
          where: { name: ILike(normalizedName) },
        });

        if (!tag) {
          tag = this.tagRepository.create({ name: normalizedName });
          await this.tagRepository.save(tag);
        }

        // Avoid duplicates
        if (!tags.some((t) => t.id === tag.id)) {
          tags.push(tag);
        }
      }
    }

    const post = this.postRepository.create({
      content: dto.content,
      authorId,
      tags,
    });

    await this.postRepository.save(post);

    // Reload with author
    const savedPost = await this.postRepository.findOne({
      where: { id: post.id },
      relations: ['author', 'tags'],
    });

    if (!savedPost) {
      throw new NotFoundException('Post not found after creation');
    }

    return this.mapToResponse(savedPost);
  }

  async findAll(query: GetPostsQueryDto): Promise<PostsListResponseDto> {
    const { authorIds, tagIds, limit = 20, cursor, sort = SortOrder.DESC } = query;

    const qb = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.tags', 'tag')
      .orderBy('post.createdAt', sort === SortOrder.ASC ? 'ASC' : 'DESC')
      .take(limit + 1);

    // Cursor pagination
    if (cursor) {
      const cursorPost = await this.postRepository.findOne({
        where: { id: cursor },
      });

      if (cursorPost) {
        if (sort === SortOrder.DESC) {
          qb.andWhere('post.createdAt < :cursorDate', {
            cursorDate: cursorPost.createdAt,
          });
        } else {
          qb.andWhere('post.createdAt > :cursorDate', {
            cursorDate: cursorPost.createdAt,
          });
        }
      }
    }

    // Filter by authors
    if (authorIds?.length) {
      qb.andWhere('post.authorId IN (:...authorIds)', { authorIds });
    }

    // Filter by tags
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

  private mapToResponse(post: PostEntity): PostResponseDto {
    return {
      id: post.id,
      content: post.content,
      tags: post.tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
      })),
      authorId: post.author.id,
      authorName: post.author.name,
      authorColor: post.author.color,
      createdAt: post.createdAt,
    };
  }
}
