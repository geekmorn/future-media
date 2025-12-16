import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostEntity } from '../../entities';
import { TagsService } from '../tags/tags.service';

describe('PostsService', () => {
  let service: PostsService;
  let postRepository: jest.Mocked<Repository<PostEntity>>;
  let tagsService: jest.Mocked<TagsService>;

  const mockUser = {
    id: 'user-1',
    name: 'testuser',
    color: '#6366f1',
    passwordHash: 'hash',
    googleId: null,
    createdAt: new Date(),
    posts: [],
  };

  const mockPost: PostEntity = {
    id: 'post-1',
    content: 'Test post content',
    authorId: 'user-1',
    author: mockUser,
    tags: [{ id: 'tag-1', name: 'test', createdAt: new Date(), posts: [] }],
    createdAt: new Date('2024-01-01'),
  };

  beforeEach(async () => {
    const mockPostRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const mockTagsService = {
      findByIds: jest.fn(),
      findOrCreateByNames: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(PostEntity),
          useValue: mockPostRepository,
        },
        {
          provide: TagsService,
          useValue: mockTagsService,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    postRepository = module.get(getRepositoryToken(PostEntity));
    tagsService = module.get(TagsService);
  });

  describe('delete', () => {
    it('should delete post when user is the author', async () => {
      postRepository.findOne.mockResolvedValue(mockPost);
      postRepository.remove.mockResolvedValue(mockPost);

      await service.delete('post-1', 'user-1');

      expect(postRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'post-1' },
      });
      expect(postRepository.remove).toHaveBeenCalledWith(mockPost);
    });

    it('should throw NotFoundException when post does not exist', async () => {
      postRepository.findOne.mockResolvedValue(null);

      await expect(service.delete('nonexistent', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException when user is not the author', async () => {
      postRepository.findOne.mockResolvedValue(mockPost);

      await expect(service.delete('post-1', 'other-user')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('update', () => {
    it('should throw ForbiddenException when user tries to edit another users post', async () => {
      postRepository.findOne.mockResolvedValue(mockPost);

      await expect(
        service.update('post-1', { content: 'Updated' }, 'other-user'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException when post does not exist', async () => {
      postRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update('nonexistent', { content: 'Updated' }, 'user-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a post with tags', async () => {
      const tags = [{ id: 'tag-1', name: 'test', createdAt: new Date(), posts: [] }];
      tagsService.findByIds.mockResolvedValue(tags);
      postRepository.create.mockReturnValue(mockPost);
      postRepository.save.mockResolvedValue(mockPost);
      postRepository.findOne.mockResolvedValue(mockPost);

      const result = await service.create(
        { content: 'New post', tagIds: ['tag-1'] },
        'user-1',
      );

      expect(result).toEqual({
        id: mockPost.id,
        content: mockPost.content,
        tags: [{ id: 'tag-1', name: 'test' }],
        authorId: mockUser.id,
        authorName: mockUser.name,
        authorColor: mockUser.color,
        createdAt: mockPost.createdAt,
      });
    });

    it('should throw NotFoundException when some tags do not exist', async () => {
      tagsService.findByIds.mockResolvedValue([]);

      await expect(
        service.create({ content: 'New post', tagIds: ['nonexistent'] }, 'user-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});

