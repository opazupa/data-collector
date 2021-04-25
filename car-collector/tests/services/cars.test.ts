import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';
import { DateTime } from 'luxon';

import { CarAd, getCars, IAuthResponse, ICountResponse } from '../../app/services/cars';

const mock = new MockAdapter(axios);

const TESLA = { model: { name: 'Tesla' }, price: 100000, registerNumber: 'XXX-345' };
const OPEL = { model: { name: 'Opel' }, price: 4000, registerNumber: 'OPO-341' };

describe('Car api service', () => {
  beforeEach(() => {
    mock.reset();
    // Mock auth Success
    mock.onPost(/auth/).reply(200, { access_token: 'test-token' } as IAuthResponse);
  });

  it('Get zero pages of cars', async () => {
    const amount = 0;
    mock.onGet(/search-count?/).replyOnce(200, { total: amount } as ICountResponse);

    const cars = await getCars({ fromDate: DateTime.now() });
    expect(cars).be.empty;
    expect(cars).length(0);
  });

  it('Get 1 page of cars', async () => {
    const amount = 1;
    mock.onGet(/search-count?/).replyOnce(200, { total: amount } as ICountResponse);
    mock.onGet(/search?/).reply(200, [TESLA, OPEL] as CarAd[]);

    const cars = await getCars({ fromDate: DateTime.now() });
    expect(cars).not.be.empty;
    expect(cars).length(2, 'Page calculated with 100, but the mock returns 2 cars per page');
    expect(cars).to.have.deep.members([TESLA, OPEL]);
  });

  it('Get 2 pages of cars', async () => {
    const amount = 199;
    mock.onGet(/search-count?/).replyOnce(200, { total: amount } as ICountResponse);
    mock.onGet(/search?/).reply(200, [TESLA, OPEL] as CarAd[]);

    const cars = await getCars({ fromDate: DateTime.now() });
    expect(cars).not.be.empty;
    expect(cars).length(4, 'Page calculated with 100, but the mock returns 2 cars per page');
    expect(cars).to.deep.include.members([TESLA, OPEL]);
  });

  it('Get 11 pages of cars', async () => {
    const amount = 1031;
    mock.onGet(/search-count?/).replyOnce(200, { total: amount } as ICountResponse);
    mock.onGet(/search?/).reply(200, [TESLA, OPEL] as CarAd[]);

    const cars = await getCars({ fromDate: DateTime.now() });
    expect(cars).not.be.empty;
    expect(cars).length(22, 'Page calculated with 100, but the mock returns 2 cars per page');
    expect(cars).to.deep.include.members([TESLA, OPEL]);
  });
});
