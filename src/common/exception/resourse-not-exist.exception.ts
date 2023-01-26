import { NotFoundException } from '@nestjs/common';

export class ResourseNotExist extends NotFoundException {
  constructor() {
    super('Resource does not exist');
  }
}
