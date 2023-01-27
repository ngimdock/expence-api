import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { GetUserId } from 'src/auth/decorators';
import { CreateExpenseDto, UpdateExpenseDto } from './dtos';
import { expenseRoutes } from './enums';
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
    @Param(ExpenseController.expenseId, ParseIntPipe) expenseId: number,
  ) {
    return this.expenseService.findByIdUserExpense(userId, expenseId);
  }

  @Post(expenseRoutes.create)
  async createUserExpense(
    @Body() createExpenseDto: CreateExpenseDto,
    @GetUserId() userId: number,
  ) {
    return this.expenseService.createUserExpense(userId, createExpenseDto);
  }

  @Patch(`${expenseRoutes.update}/:${ExpenseController.expenseId}`)
  async updateUserExpense(
    @GetUserId() userId: number,
    @Param(ExpenseController.expenseId, ParseIntPipe) expenseId: number,
    @Body() updateExpenseDto: Partial<UpdateExpenseDto>,
  ) {
    return this.expenseService.updateUserExpense(
      userId,
      expenseId,
      updateExpenseDto,
    );
  }

  @Delete(`:${ExpenseController.expenseId}`)
  async deleteByIdUserExpense(
    @GetUserId() userId: number,
    @Param(ExpenseController.expenseId, ParseIntPipe) expenseId: number,
  ) {
    return this.expenseService.deleteByIdUserExpense(userId, expenseId);
  }
}
