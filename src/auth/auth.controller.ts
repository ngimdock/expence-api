import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Session,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dtos';
import { authRoutes } from './enums';
import { UserSession } from './types';

@Controller(authRoutes.auth)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(authRoutes.register)
  async register(@Body() authDto: AuthDto, @Session() session: UserSession) {
    const { id, email } = await this.authService.register(authDto);

    this.serializeSession(id, email, session);
  }

  @Post(authRoutes.login)
  @HttpCode(HttpStatus.OK)
  async login(@Body() authDto: AuthDto, @Session() session: UserSession) {
    const { id, email } = await this.authService.login(authDto);

    this.serializeSession(id, email, session);
  }

  private serializeSession(id: number, email: string, session: UserSession) {
    session.user = {
      id,
      email,
    };
  }
}
