import { NotAcceptableException } from '@nestjs/common';

export class UserNotFound extends NotAcceptableException {
  constructor() {
    super('User not found.');
  }
}
