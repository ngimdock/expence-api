import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Session,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { PublicRoute } from './decorators';
import { AuthDto } from './dtos';
import { authRoutes } from './enums';
import { UserSession, UserSessionData } from './types';

@Controller(authRoutes.auth)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicRoute()
  @Post(authRoutes.register)
  async register(@Body() authDto: AuthDto, @Session() session: UserSession) {
    const userSessionDta = await this.authService.register(authDto);

    this.serializeSession(userSessionDta, session);
  }

  @PublicRoute()
  @Post(authRoutes.login)
  @HttpCode(HttpStatus.OK)
  async login(@Body() authDto: AuthDto, @Session() session: UserSession) {
    const userSessionDta = await this.authService.login(authDto);

    this.serializeSession(userSessionDta, session);
  }

  private serializeSession(
    userSessionDta: UserSessionData,
    session: UserSession,
  ) {
    session.user = {
      id: userSessionDta.id,
      email: userSessionDta.email,
      role: userSessionDta.role,
    };
  }
}
