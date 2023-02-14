import { Injectable } from '@nestjs/common';

@Injectable()
export class SimpleService {
  testMe(value: number) {
    return value + 1;
  }

  testMeWithMock(value: number) {
    const randomValue = Math.floor(Math.random() * 100);

    return value + randomValue;
  }
}
