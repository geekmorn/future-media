import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { GetUsersQueryDto, UsersListResponseDto } from './dto';
import { Public } from '../../common/decorators';
import { PAGINATION } from '../../common/constants';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get users with optional search' })
  @ApiQuery({ name: 'search', required: false, description: 'Search query' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: `Max users (1-${PAGINATION.MAX_USERS_LIMIT})`,
  })
  @ApiResponse({ status: 200, description: 'List of users', type: UsersListResponseDto })
  findAll(@Query() query: GetUsersQueryDto): Promise<UsersListResponseDto> {
    return this.usersService.findAll(query);
  }
}
