import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dtos';
import { authRoutes } from './enums';

@Controller(authRoutes.auth)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(authRoutes.register)
  register(@Body() authDto: AuthDto) {
    return this.authService.register(authDto);
  }

  @Post(authRoutes.login)
  @HttpCode(HttpStatus.OK)
  login(@Body() authDto: AuthDto) {
    return this.authService.login(authDto);
  }
}
