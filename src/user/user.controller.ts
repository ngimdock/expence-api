import { Controller, Get, Query } from '@nestjs/common';
import { AdminRoute, GetUserId } from 'src/auth/decorators';
import { PaginateDto } from 'src/common/dtos';
import { userRoutes } from './enums';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(userRoutes.me)
  findMe(@GetUserId() userId: number) {
    return this.userService.findMe(userId);
  }

  @AdminRoute()
  @Get(userRoutes.all)
  findAll(@Query() paginate: PaginateDto) {
    return this.userService.findAll(paginate);
  }
}
