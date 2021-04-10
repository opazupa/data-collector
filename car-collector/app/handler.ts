import { Handler } from 'aws-lambda';

import { Hello } from './models/hello';
import { getCars } from './services/cars';
import { save } from './services/storage';
import { wrapHandler, yesterday } from './utils';

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
  const date = yesterday();
  const cars = await getCars({ fromDate: date });

  // Save if we have results
  if (cars.length !== 0) await save(cars, date);
});
