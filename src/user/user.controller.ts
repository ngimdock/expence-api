import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUserId } from 'src/auth/decorators';
import { userRoutes } from './enums';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(userRoutes.me)
  findMe(@GetUserId() userId: number) {
    return this.userService.findMe(userId);
  }
}
