import { Handler } from 'aws-lambda';

import { getCars } from './services/cars';
import { save } from './services/storage';
import { wrapHandler, yesterday } from './utils';

/**
 * Save new cars from yesterday to S3 storage
 */
export const saveNewCars: Handler = wrapHandler(async () => {
  const date = yesterday();
  const cars = await getCars({ fromDate: date });

  // Save if we have results
  if (cars.length !== 0) await save(cars, date);
});
