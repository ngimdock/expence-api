import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUserId } from 'src/auth/decorators';
import { SessionGuard } from 'src/auth/guards';
import { userRoutes } from './enums';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(SessionGuard)
  @Get(userRoutes.me)
  findMe(@GetUserId() userId: number) {
    console.log({ userId });

    return this.userService.findMe(userId);
  }
}
