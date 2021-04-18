import { expect } from 'chai';
import lambdaTester from 'lambda-tester';
import { DateTime } from 'luxon';
import sinon from 'sinon';

import { bulkImportCars, BulkParams, saveNewCars } from '../../app/handler';
import { Car } from '../../app/models';
import * as carAPI from '../../app/services/cars/api';
import * as storage from '../../app/services/storage';

const CARS = [
  { model: 'Tesla', registerNumber: 'XXX-345' },
  { model: 'Opel', registerNumber: 'OPO-341' },
] as Car[];

describe('Car collector handler', () => {
  it('Save new cars from yesterday', async () => {
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

  it('Bulk import cars', async () => {
    const from = DateTime.utc().set({ day: -10 }).startOf('day').toISO();
    const to = DateTime.utc().set({ day: -5 }).startOf('day').toISO();

    const carMock = sinon.mock(carAPI);
    const storageMock = sinon.mock(storage);

    carMock.expects('getCars').exactly(5).returns(CARS);
    storageMock.expects('save').exactly(5);

    await lambdaTester(bulkImportCars)
      .event({ from, to })
      .expectResult(() => {
        carMock.verify();
        carMock.restore();
        storageMock.verify();
        storageMock.restore();
      });
  });

  it('Bulk import cars with zero diff', async () => {
    const from = DateTime.utc().set({ day: -5 }).startOf('day').toISO();
    const to = from;

    const carMock = sinon.mock(carAPI);
    const storageMock = sinon.mock(storage);

    carMock.expects('getCars').never();
    storageMock.expects('save').never();

    await lambdaTester(bulkImportCars)
      .event({ from, to })
      .expectError((err: Error) => {
        expect(err.message).to.equal('Too small gap between dates!');
        carMock.verify();
        carMock.restore();
        storageMock.verify();
        storageMock.restore();
      });
  });

  it('Bulk import cars with upside dates', async () => {
    const from = DateTime.utc().set({ day: -5 }).startOf('day').toISO();
    const to = DateTime.utc().set({ day: -10 }).startOf('day').toISO();

    const carMock = sinon.mock(carAPI);
    const storageMock = sinon.mock(storage);

    carMock.expects('getCars').never();
    storageMock.expects('save').never();

    await lambdaTester(bulkImportCars)
      .event({ from, to })
      .expectError((err: Error) => {
        expect(err.message).to.equal('Too small gap between dates!');
        carMock.verify();
        carMock.restore();
        storageMock.verify();
        storageMock.restore();
      });
  });

  it('Bulk import cars with bad dates', async () => {
    const carMock = sinon.mock(carAPI);
    const storageMock = sinon.mock(storage);

    carMock.expects('getCars').never();
    storageMock.expects('save').never();

    await lambdaTester(bulkImportCars)
      .event({ from: '', to: '2012-07-14T01:00:00+01:00zs' })
      .expectError((err: Error) => {
        expect(err.message).to.equal('Invalid dates passed!');
        carMock.verify();
        carMock.restore();
        storageMock.verify();
        storageMock.restore();
      });
  });

  it('Bulk import cars without dates', async () => {
    const carMock = sinon.mock(carAPI);
    const storageMock = sinon.mock(storage);

    carMock.expects('getCars').never();
    storageMock.expects('save').never();

    await lambdaTester(bulkImportCars)
      .event({} as BulkParams)
      .expectError((err: Error) => {
        expect(err.message).to.equal('Invalid dates passed!');
        carMock.verify();
        carMock.restore();
        storageMock.verify();
        storageMock.restore();
      });
  });
});
