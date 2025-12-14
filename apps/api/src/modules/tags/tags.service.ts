import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { TagEntity } from '../../entities';
import { GetTagsQueryDto, TagsListResponseDto } from './dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}

  async findAll(query: GetTagsQueryDto): Promise<TagsListResponseDto> {
    const { search, limit = 20 } = query;

    const where = search
      ? { name: ILike(`%${search}%`) }
      : {};

    const tags = await this.tagRepository.find({
      where,
      take: limit,
      order: { name: 'ASC' },
    });

    return {
      items: tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
      })),
    };
  }
}
