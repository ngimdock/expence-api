import { Injectable } from '@nestjs/common';

@Injectable()
export class SimpleService {
  testMe(value: number) {
    return value + 1;
  }
}
