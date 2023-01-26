import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dtos';
import * as argon from 'argon2';
import { CredentialsIncorrectException } from 'src/common/exception';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(authDto: AuthDto) {
    const userExist = await this.prisma.user.findUnique({
      where: {
        email: authDto.email,
      },
    });

    if (userExist) throw new CredentialsIncorrectException();

    const hashedPassword = await argon.hash(authDto.password);

    const userData = {
      email: authDto.email,
      hash: hashedPassword,
    };

    const user = await this.prisma.user.create({
      data: userData,
    });

    return { id: user.id, email: user.email };
  }

  async login(authDto: AuthDto) {
    const userFound = await this.prisma.user.findUnique({
      where: {
        email: authDto.email,
      },
    });

    if (!userFound) throw new CredentialsIncorrectException();

    const isPasswordValid = await argon.verify(
      userFound.hash,
      authDto.password,
    );

    if (!isPasswordValid) throw new CredentialsIncorrectException();

    return { id: userFound.id, email: userFound.email };
  }
}
