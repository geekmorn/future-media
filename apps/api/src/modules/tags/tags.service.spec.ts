import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagsService } from './tags.service';
import { TagEntity } from '../../entities';

describe('TagsService', () => {
  let service: TagsService;
  let tagRepository: jest.Mocked<Repository<TagEntity>>;

  const mockTag: TagEntity = {
    id: 'tag-1',
    name: 'javascript',
    createdAt: new Date(),
    posts: [],
  };

  beforeEach(async () => {
    const mockTagRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      findBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagsService,
        {
          provide: getRepositoryToken(TagEntity),
          useValue: mockTagRepository,
        },
      ],
    }).compile();

    service = module.get<TagsService>(TagsService);
    tagRepository = module.get(getRepositoryToken(TagEntity));
  });

  describe('findAll', () => {
    it('should return tags list', async () => {
      const tags = [mockTag, { ...mockTag, id: 'tag-2', name: 'typescript' }];
      tagRepository.find.mockResolvedValue(tags);

      const result = await service.findAll({});

      expect(result.items).toHaveLength(2);
      expect(result.items[0]).toEqual({ id: mockTag.id, name: mockTag.name });
    });

    it('should apply search filter', async () => {
      tagRepository.find.mockResolvedValue([mockTag]);

      await service.findAll({ search: 'java' });

      expect(tagRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            name: expect.anything(),
          }),
        }),
      );
    });

    it('should apply limit', async () => {
      tagRepository.find.mockResolvedValue([mockTag]);

      await service.findAll({ limit: 5 });

      expect(tagRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 5,
        }),
      );
    });
  });

  describe('findByIds', () => {
    it('should return empty array when no ids provided', async () => {
      const result = await service.findByIds([]);

      expect(result).toEqual([]);
      expect(tagRepository.findBy).not.toHaveBeenCalled();
    });

    it('should return tags by ids', async () => {
      tagRepository.findBy.mockResolvedValue([mockTag]);

      const result = await service.findByIds(['tag-1']);

      expect(result).toEqual([mockTag]);
    });
  });

  describe('findOrCreateByNames', () => {
    it('should return empty array when no names provided', async () => {
      const result = await service.findOrCreateByNames([]);

      expect(result).toEqual([]);
    });

    it('should find existing tag by name', async () => {
      tagRepository.findOne.mockResolvedValue(mockTag);

      const result = await service.findOrCreateByNames(['JavaScript']);

      expect(result).toEqual([mockTag]);
      expect(tagRepository.save).not.toHaveBeenCalled();
    });

    it('should create new tag when not found', async () => {
      const newTag = { ...mockTag, id: 'new-tag', name: 'newtag' };
      tagRepository.findOne.mockResolvedValue(null);
      tagRepository.create.mockReturnValue(newTag);
      tagRepository.save.mockResolvedValue(newTag);

      const result = await service.findOrCreateByNames(['NewTag']);

      expect(result).toEqual([newTag]);
      expect(tagRepository.create).toHaveBeenCalledWith({ name: 'newtag' });
      expect(tagRepository.save).toHaveBeenCalled();
    });

    it('should skip empty tag names', async () => {
      tagRepository.findOne.mockResolvedValue(mockTag);

      const result = await service.findOrCreateByNames(['  ', 'javascript', '']);

      expect(result).toEqual([mockTag]);
      expect(tagRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should not duplicate tags', async () => {
      tagRepository.findOne.mockResolvedValue(mockTag);

      const result = await service.findOrCreateByNames(['javascript', 'JavaScript']);

      expect(result).toHaveLength(1);
    });
  });
});
