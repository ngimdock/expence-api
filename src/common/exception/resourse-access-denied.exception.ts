import { ForbiddenException } from '@nestjs/common';

export class ResourseAccessDenied extends ForbiddenException {
  constructor() {
    super('Access to resource forbiden');
  }
}
