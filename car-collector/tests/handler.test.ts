import { expect } from 'chai';
import lambdaTester from 'lambda-tester';
import sinon from 'sinon';

import { hello } from '../app/handler';
import * as moi from '../app/models/hello';

describe('Car collector handler', () => {
  it('Get message', () => {
    const TEST_MOCK = 'HEIII!!!';
    const s = sinon.mock(moi);

    s.expects('Hello').once().returns(TEST_MOCK);

    lambdaTester(hello)
      .event({ pathParameters: { id: 25768396 } })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .expectResult((result: { statusCode: number; body: { message: string } }) => {
        const { statusCode, body } = result;

        expect(statusCode).to.equal(200);
        expect(body.message).to.equal(TEST_MOCK);
        s.verify();
        s.restore();
      });
  });
});
