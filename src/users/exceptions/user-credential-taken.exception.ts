import { ForbiddenException } from '@nestjs/common';

export class UserCredentialTaken extends ForbiddenException {
  constructor() {
    super('Credential incorrect');
  }
}
