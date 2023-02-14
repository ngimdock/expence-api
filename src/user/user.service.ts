import { Injectable } from '@nestjs/common';
import { PaginateDto } from 'src/common/dtos';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findMe(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    delete user.hash;

    return user;
  }

  async findAll(paginate: PaginateDto) {
    const allUsers = await this.prisma.user.findMany({
      select: {
        id: true,
        firstname: true,
        lastname: true,
        createdAt: true,
        _count: {
          select: {
            expenses: true,
          },
        },
      },
      skip: paginate.offset,
      take: paginate.limit,
    });

    return allUsers;
  }
}
