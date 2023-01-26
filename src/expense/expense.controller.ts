import { Controller, Get, Param } from '@nestjs/common';
import { GetUserId } from 'src/auth/decorators';
import { ExpenseService } from './expense.service';

@Controller('expense')
export class ExpenseController {
  private static readonly expenseId = 'expenseId';

  constructor(private readonly expenseService: ExpenseService) {}

  @Get()
  async findAllUserExpenses(@GetUserId() userId: number) {
    return this.expenseService.findAllUserExpenses(userId);
  }

  @Get(`:${ExpenseController.expenseId}`)
  async findByIdUserExpense(
    @GetUserId() userId: number,
    @Param(ExpenseController.expenseId) expenseId: number,
  ) {
    return this.expenseService.findByIdUserExpense(userId, expenseId);
  }
}
