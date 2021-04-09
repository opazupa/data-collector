import { Handler } from 'aws-lambda';

import { Hello } from './models/hello';
import { getNewCars } from './services/car-api';
import { list } from './services/storage';
import { wrapHandler } from './utils/sentry';

// TODO remove
export const hello: Handler = wrapHandler(async (event) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: Hello('moi'),
        input: event,
      },
      null,
      2,
    ),
  };
  return new Promise((resolve) => {
    resolve(response);
  });
});

/**
 * Save new cars from yesterday to S3 storage
 */
export const saveNewCars: Handler = wrapHandler(async () => {
  const cars = await getNewCars();
  console.log(cars.length);
});

export const getBuckets = () => {
  const buckets = list();
  console.log(buckets);
};
