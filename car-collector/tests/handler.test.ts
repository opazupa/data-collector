import { expect } from 'chai';
import lambdaTester from 'lambda-tester';
import sinon from 'sinon';
import { createMock } from 'ts-auto-mock';

import { hello, saveNewCars } from '../app/handler';
import { Car } from '../app/models';
import * as carAPI from '../app/services/cars';
import * as storage from '../app/services/storage';

describe('Car collector handler', () => {
  it('Get message', async () => {
    const TEST_MOCK = 'HEIII!!!';
    const s = sinon.mock(moi);

    s.expects('Hello').once().returns(TEST_MOCK);

    await lambdaTester(hello)
      .event({ pathParameters: { id: 25768396 } })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .expectResult((result: { statusCode: number; body: { message: string } }) => {
        const { statusCode, body } = result;
        expect(statusCode).to.equal(200);
        expect(body.message).to.contain(/TEST_MOCK/);
        s.verify();
        s.restore();
      });
  });
  it('Save new cars from yesterday', async () => {
    const TEST_MOCK = 'HEIII!!!';
    const s = sinon.mock(moi);
    const mock = createMock<Car>();
    s.expects('Hello').once().returns(TEST_MOCK);

    await lambdaTester(hello)
      .event({ pathParameters: { id: 25768396 } })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .expectResult((result: { statusCode: number; body: { message: string } }) => {
        const { statusCode, body } = result;
        expect(statusCode).to.equal(200);
        expect(body.message).to.contain(/TEST_MOCK/);
        s.verify();
        s.restore();
      });
  });

  it('Save no cars from yesterday', async () => {
    const carMock = sinon.mock(carAPI);
    const storageMock = sinon.mock(storage);

    carMock.expects('getCars').once().returns([]);
    storageMock.expects('getCars').once().returns([]);

    await lambdaTester(saveNewCars)
      .event({})
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .expectResult((result: { statusCode: number; body: { message: string } }) => {
        const { statusCode, body } = result;
        expect(statusCode).to.equal(200);
        expect(body.message).to.contain(/TEST_MOCK/);
        s.verify();
        s.restore();
      });
  });
});
