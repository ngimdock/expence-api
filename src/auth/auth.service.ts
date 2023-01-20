import { Injectable } from '@nestjs/common';
import { AuthDto } from './dtos';

@Injectable()
export class AuthService {
  register(authDto: AuthDto) {
    return authDto;
  }

  login(authDto: AuthDto) {
    return authDto;
  }
}
