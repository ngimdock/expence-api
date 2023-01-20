import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { authRoutes } from './enums';

@Controller(authRoutes.auth)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(authRoutes.register)
  @HttpCode(HttpStatus.OK)
  register() {
    return this.authService.register();
  }

  @Post(authRoutes.login)
  @HttpCode(HttpStatus.OK)
  login() {
    return this.authService.login();
  }
}
