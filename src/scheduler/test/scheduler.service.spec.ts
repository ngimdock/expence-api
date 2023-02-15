import { Test } from '@nestjs/testing';
import { UsersWithExpensesStub } from '../../user/stubs';
import { PrismaService } from '../../prisma/prisma.service';
import { SchedulerService } from '../scheduler.service';

jest.mock('../../prisma/prisma.service.ts');

describe('SchedulerService', () => {
  let service: SchedulerService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [SchedulerService, PrismaService],
    }).compile();

    service = module.get<SchedulerService>(SchedulerService);
  });

  it('bootstrap', () => {
    expect(service).toBeDefined();
  });

  describe('calculateExpensesAmount()', () => {
    let totalExpensesAmount: number;

    beforeEach(() => {
      totalExpensesAmount = service.calculateExpensesAmount(
        UsersWithExpensesStub()[0].expenses,
      );
    });

    describe('When it called', () => {
      it('should return the total amount of expenses', () => {
        expect(totalExpensesAmount).toEqual(150);
      });
    });
  });
});
