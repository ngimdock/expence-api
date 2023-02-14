import { Injectable } from '@nestjs/common';

@Injectable()
export class SimpleService {
  testMe(value: number) {
    return value + 1;
  }

  testMeWithMock(value: number) {
    const randomValue = this.generateRandom();

    return value + randomValue;
  }

  generateRandom() {
    return Math.floor(Math.random() * 100);
  }
}
