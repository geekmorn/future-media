import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { UserEntity } from '../../entities';
import { GetUsersQueryDto, UsersListResponseDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(query: GetUsersQueryDto): Promise<UsersListResponseDto> {
    const { search, limit = 20 } = query;

    const where = search ? { name: ILike(`%${search}%`) } : {};

    const users = await this.userRepository.find({
      where,
      take: limit,
      order: { name: 'ASC' },
    });

    return {
      items: users.map((user) => ({
        id: user.id,
        name: user.name,
        color: user.color,
      })),
    };
  }
}
