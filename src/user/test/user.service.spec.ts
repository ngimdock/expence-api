import { Test } from '@nestjs/testing';
import { UserService } from '../user.service';
import { PrismaService } from '../../prisma/prisma.service';
import { Role, User } from '@prisma/client';

describe('UserService', () => {
  let service: UserService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn().mockResolvedValue({
                id: 1,
                email: 'ngimdock@gmail.com',
                createdAt: new Date(),
                updatedAt: new Date(),
                firstname: null,
                lastname: null,
                initialBalance: 2000,
                currentBalance: 1970,
                role: Role.USER,
              }),
            },
          },
        },
      ],
    }).compile();

    service = module.get(UserService);
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
      it('Should return a user', async () => {
        expect(user).toBeDefined();
        expect(user.id).toBe(1);
      });

      it("Shouldn't return the user's password hash", () => {
        expect(user.hash).toBeUndefined();
      });
    });
  });
});
