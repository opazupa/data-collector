import { Handler } from 'aws-lambda';
import { DateTime } from 'luxon';

import { authenticate, getCars } from './services/cars';
import { save } from './services/storage';
import { wrapHandler } from './utils';

/**
 * Save new cars from today to S3 storage
 */
export const saveNewCars: Handler = wrapHandler(async () => {
  const date = DateTime.utc().startOf('day');

  // Handle API auth once
  await authenticate();

  // New forsale and sold cars
  const allCars = (
    await Promise.all([getCars({ fromDate: date, status: 'forsale' }), getCars({ fromDate: date, status: 'sold' })])
  ).flat();

  // Save if we have results
  if (allCars.length !== 0) await save(allCars, date);
});

// Bulk operation paramaters
export type BulkParams = {
  from: string;
  to: string;
};

/**
 * Bulk import cars
 */
export const bulkImportCars: Handler<BulkParams> = wrapHandler(async (event) => {
  let startDate = DateTime.fromISO(event.from, { zone: 'utc' }).startOf('day');
  const endDate = DateTime.fromISO(event.to, { zone: 'utc' }).startOf('day');

  // Validate input dates
  if (!(startDate.isValid && endDate.isValid)) throw new Error('Invalid dates passed!');
  const { days } = endDate.diff(startDate, ['days']).toObject();
  if (days < 1) throw new Error('Too small gap between dates!');

  console.log(`Bulk import for cars triggered with ${days} days.`);

  // Handle API auth once
  await authenticate();

  // Handle every date in between
  for (let progress = 1; progress <= days; progress++) {
    console.log(`Progress: ${progress}/${days}. Getting cars for ${startDate.toISODate()}.`);

    // Forsale and sold cars
    const allCars = (
      await Promise.all([
        getCars({ fromDate: startDate, toDate: startDate.endOf('day'), status: 'forsale' }),
        getCars({ fromDate: startDate, toDate: startDate.endOf('day'), status: 'sold' }),
      ])
    ).flat();

    // Save if we have results
    if (allCars.length !== 0) await save(allCars, startDate);
    // Move to next date
    startDate = startDate.plus({ day: 1 });
  }
  console.log(`All set! Imported cars from ${days} days.`);
});
