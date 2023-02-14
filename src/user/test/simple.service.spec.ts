import { Test } from '@nestjs/testing';
import { SimpleService } from '../simple.service';

describe('SimpleService', () => {
  let service: SimpleService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [SimpleService],
    }).compile();

    service = module.get(SimpleService);
  });

  it('bootstrap', () => {
    expect(service).toBeDefined();
  });

  describe('testMe()', () => {
    let result: number;

    beforeEach(() => {
      result = service.testMe(5);
    });

    describe('when call', () => {
      it('Should return a number', () => {
        expect(typeof result).toBe('number');
      });

      it('Should return the value + 1', () => {
        //
        expect(result).toBe(6);
      });
    });
  });
});
