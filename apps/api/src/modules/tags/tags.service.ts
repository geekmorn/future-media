import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, In } from 'typeorm';
import { TagEntity } from '../../entities';
import { TagDto } from '../../common/dto';
import { GetTagsQueryDto, TagsListResponseDto } from './dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}

  async findAll(query: GetTagsQueryDto): Promise<TagsListResponseDto> {
    const { search, limit = 20 } = query;

    const where = search ? { name: ILike(`%${search}%`) } : {};

    const tags = await this.tagRepository.find({
      where,
      take: limit,
      order: { name: 'ASC' },
    });

    return {
      items: tags.map((tag) => this.mapToDto(tag)),
    };
  }

  async findByIds(ids: string[]): Promise<TagEntity[]> {
    if (!ids.length) return [];
    return this.tagRepository.findBy({ id: In(ids) });
  }

  async findOrCreateByNames(names: string[]): Promise<TagEntity[]> {
    if (!names.length) return [];

    const tags: TagEntity[] = [];

    for (const tagName of names) {
      const normalizedName = tagName.trim().toLowerCase();
      if (!normalizedName) continue;

      let tag = await this.tagRepository.findOne({
        where: { name: ILike(normalizedName) },
      });

      if (!tag) {
        tag = this.tagRepository.create({ name: normalizedName });
        await this.tagRepository.save(tag);
      }

      if (!tags.some((t) => t.id === tag.id)) {
        tags.push(tag);
      }
    }

    return tags;
  }

  private mapToDto(tag: TagEntity): TagDto {
    return {
        id: tag.id,
        name: tag.name,
    };
  }
}
