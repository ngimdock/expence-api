import { Injectable } from '@nestjs/common';
import { PaginateDto } from 'src/common/dtos';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResourseNotExist, ResourseAccessDenied } from '../common/exception';
import { CreateExpenseDto, UpdateExpenseDto } from './dtos';

@Injectable()
export class ExpenseService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllUserExpenses(userId: number, paginate: PaginateDto) {
    return this.prisma.expense.findMany({
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
