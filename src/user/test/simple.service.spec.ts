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

    describe('when called', () => {
      it('Should return a number', () => {
        expect(typeof result).toBe('number');
      });

      it('Should return the value + 1', () => {
        expect(result).toBe(6);
      });
    });
  });

  describe('testMeWithMock()', () => {
    let result: number;

    beforeEach(() => {
      // Math.random = jest.fn().mockReturnValue(0.02);
      // jest.spyOn(Math, 'random').mockReturnValue(0.02);

      jest.spyOn(service, 'generateRandom').mockReturnValue(2);

      result = service.testMeWithMock(5);
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    describe('When called', () => {
      it('generateRandom() should be called', () => {
        expect(service.generateRandom).toHaveBeenCalled();

        expect(service.generateRandom).toHaveReturnedWith(2);
      });

      it('should return a number', () => {
        expect(typeof result).toBe('number');
      });

      it('should return the value + 2', () => {
        expect(result).toBe(7);
      });

      it('just another test', () => {
        jest.restoreAllMocks();

        const value = service.testMeWithMock(10);
        console.log({ value });
      });
    });
  });
});
