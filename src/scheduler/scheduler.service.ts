import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Expense } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SchedulerService {
  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async computeUsersCurrentBalance() {
    console.log(`computeUsersCurrentBalance() start runing...`);

    const users = await this.prisma.user.findMany({
      include: {
        expenses: true,
      },
    });

    for (const user of users) {
      const userExpensesAmount = user.expenses.reduce(
        (currentBalance: number, nextExpense: Expense) => {
          return currentBalance + Number(nextExpense.amount);
        },
        0,
      );

      if (user.initialBalance - userExpensesAmount === user.currentBalance)
        continue;

      await this.prisma.user
        .update({
          where: {
            id: user.id,
          },

          data: {
            currentBalance: user.initialBalance - userExpensesAmount,
          },
        })
        .catch((error) => console.log({ error }));
    }

    console.log(`computeUsersCurrentBalance() ran for ${users.length} users.`);
  }
}
