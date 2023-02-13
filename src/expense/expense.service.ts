import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { PaginateDto } from '../common/dtos';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResourseNotExist, ResourseAccessDenied } from '../common/exception';
import { CreateExpenseDto, UpdateExpenseDto } from './dtos';
import { PaginateResultType } from '../common/types';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ExpenseService {
  private configService: ConfigService;

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAllUserExpenses(
    userId: number,
    paginate: PaginateDto,
  ): Promise<PaginateResultType> {
    console.log({ paginate });
    const expenses = await this.prisma.expense.findMany({
      where: {
        userId,
      },
      include: {
        user: {
          select: {
            email: true,
            firstname: true,
            lastname: true,
          },
        },
      },
      take: paginate.limit,
      skip: paginate.offset,
    });

    const count = await this.prisma.expense.count({
      where: {
        userId,
      },
    });

    return {
      count,
      hasMore: count > paginate.offset + paginate.limit,
      data: expenses,
    };
  }

  async findByIdUserExpense(userId: number, expenseId: number) {
    const expenseFound = await this.prisma.expense.findFirst({
      where: {
        id: expenseId,
        userId: userId,
      },
      include: {
        user: {
          select: {
            email: true,
            firstname: true,
            lastname: true,
          },
        },
      },
    });

    if (!expenseFound) throw new ResourseNotExist();

    if (expenseFound.userId !== userId) throw new ResourseAccessDenied();

    return expenseFound;
  }

  async createUserExpense(userId: number, dto: CreateExpenseDto) {
    try {
      const expenseCreated = await this.prisma.expense.create({
        data: {
          ...dto,
          userId,
        },
      });

      return expenseCreated;
    } catch (err) {
      throw err;
    }
  }

  async updateUserExpense(
    userId: number,
    expenseId: number,
    dto: UpdateExpenseDto,
  ) {
    try {
      await this.findByIdUserExpense(userId, expenseId);

      const expenseUpdated = await this.prisma.expense.update({
        where: {
          id: expenseId,
        },

        data: dto,
      });

      return expenseUpdated;
    } catch (err) {
      throw err;
    }
  }

  async deleteByIdUserExpense(userId: number, expenseId: number) {
    const expenseFound = await this.findByIdUserExpense(userId, expenseId);

    await this.prisma.expense.delete({
      where: {
        id: expenseId,
      },
    });

    return expenseFound;
  }
}
