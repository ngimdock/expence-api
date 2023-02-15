import { Role, User } from '@prisma/client';

const date = new Date();

export const UserStub = (): User => ({
  id: 1,
  email: 'ngimdock@gmail.com',
  createdAt: date,
  updatedAt: date,
  firstname: null,
  lastname: null,
  initialBalance: 2000,
  currentBalance: 1970,
  role: Role.USER,
  hash: '#dvzdcze122kdd#é$&&11ad',
});
