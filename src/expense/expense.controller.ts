import {
  Body,
  CacheInterceptor,
  CacheKey,
  CacheTTL,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { GetUserId } from 'src/auth/decorators';
import { PaginateDto } from '../common/dtos';
import { CreateExpenseDto, UpdateExpenseDto } from './dtos';
import { expenseRoutes } from './enums';
import { ExpenseService } from './expense.service';

@Controller('expense')
export class ExpenseController {
  private static readonly expenseId = 'expenseId';

  constructor(private readonly expenseService: ExpenseService) {}

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(5)
  @CacheKey('all-expenses')
  @Get()
  async findAllUserExpenses(
    @GetUserId() userId: number,
    @Query() paginate: PaginateDto,
  ) {
    return this.expenseService.findAllUserExpenses(userId, paginate);
  }

  @Get(`:${ExpenseController.expenseId}`)
  async findByIdUserExpense(
    @GetUserId() userId: number,
    @Param(ExpenseController.expenseId) expenseId: number,
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
    @Param(ExpenseController.expenseId) expenseId: number,
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
    @Param(ExpenseController.expenseId) expenseId: number,
  ) {
    return this.expenseService.deleteByIdUserExpense(userId, expenseId);
  }
}
