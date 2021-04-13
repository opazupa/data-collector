import { DateTime } from 'luxon';

/**
 * Get today's date at midnight
 *
 */
export const today = (): DateTime => DateTime.utc().set({ hour: 0, minute: 0, second: 0 });
