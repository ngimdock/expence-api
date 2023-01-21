import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserCredentialTaken } from 'src/users/exceptions';
import { AuthDto } from './dtos';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(authDto: AuthDto) {
    const userExist = await this.prisma.user.findFirst({
      where: {
        email: authDto.email,
      },
    });

    if (userExist) throw new UserCredentialTaken();

    const hashedPassword = await argon.hash(authDto.password);

    const userData = {
      email: authDto.email,
      hash: hashedPassword,
    };

    const user = await this.prisma.user.create({
      data: userData,
    });

    return user;
  }

  async login(authDto: AuthDto) {
    return authDto;
  }
}
