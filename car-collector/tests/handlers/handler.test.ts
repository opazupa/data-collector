import lambdaTester from 'lambda-tester';
import sinon from 'sinon';

import { saveNewCars } from '../../app/handler';
import { Car } from '../../app/models';
import * as carAPI from '../../app/services/cars/api';
import * as storage from '../../app/services/storage';

describe('Car collector handler', () => {
  it('Save new cars from yesterday', async () => {
    const CARS = [
      { model: 'Tesla', registerNumber: 'XXX-345' },
      { model: 'Opel', registerNumber: 'OPO-341' },
    ] as Car[];
    const carMock = sinon.mock(carAPI);
    const storageMock = sinon.mock(storage);

    carMock.expects('getCars').once().returns(CARS);
    storageMock.expects('save').once().withArgs(CARS);

    await lambdaTester(saveNewCars)
      .event({})
      .expectResult(() => {
        carMock.verify();
        carMock.restore();
        storageMock.verify();
        storageMock.restore();
      });
  });

  it('Save no cars from yesterday', async () => {
    const carMock = sinon.mock(carAPI);
    const storageMock = sinon.mock(storage);

    carMock.expects('getCars').once().returns([]);
    storageMock.expects('save').never();

    await lambdaTester(saveNewCars)
      .event({})
      .expectResult(() => {
        carMock.verify();
        carMock.restore();
        storageMock.verify();
        storageMock.restore();
      });
  });
});
