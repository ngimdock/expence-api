import { Test } from '@nestjs/testing';
import { UserService } from '../user.service';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client';
import { UserStub } from '../stubs';

jest.mock('../../prisma/prisma.service');

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    service = module.get(UserService);
    prisma = module.get(PrismaService);
  });

  it('bootstrap', () => {
    expect(service).toBeDefined();
  });

  describe('findMe()', () => {
    let user: User;

    beforeEach(async () => {
      user = await service.findMe(1);
    });

    describe('Went called', () => {
      it('findUnique() should be called', () => {
        expect(prisma.user.findUnique).toHaveBeenCalledWith({
          where: {
            id: UserStub().id,
          },
        });

        expect(prisma.user.findUnique).toHaveReturnedWith(
          Promise.resolve(UserStub()),
        );
      });

      it('Should return a user', async () => {
        const _user = UserStub();
        delete _user.hash;
        expect(user).toMatchObject(_user);
      });
    });
  });
});
