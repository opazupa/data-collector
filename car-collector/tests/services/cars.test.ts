import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';
import { DateTime } from 'luxon';

import { getCars, IAuthResponse } from '../../app/services/cars';

const mock = new MockAdapter(axios);

describe('Car collector handler', () => {
  beforeEach(() => {
    mock.reset();
    mock.onPost(/auth/).reply(200, { access_token: 'testtoken' } as IAuthResponse);
  });

  it('Save new cars from yesterday', async () => {
    // const CARS = [
    //   { model: 'Tesla', registerNumber: 'XXX-345' },
    //   { model: 'Opel', registerNumber: 'OPO-345' },
    // ] as Car[];

    // carMock.expects('getCars').once().returns(CARS);
    // storageMock.expects('save').once().withArgs(CARS);
    const cars = await getCars({ fromDate: DateTime.now() });
    expect(cars).be.empty;
  });
});
