import { DateTime } from 'luxon';

/**
 * Get yesterday date string
 *
 *  @returns {string}
 */
export const yesterday = (): DateTime => DateTime.utc().plus({ days: -1 }).set({ hour: 0, minute: 0, second: 0 });
