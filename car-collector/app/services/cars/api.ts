import axios from 'axios';
import axiosRetry from 'axios-retry';
import { DateTime } from 'luxon';
import qs from 'qs';

import { Configuration } from '../../configuration';
import { CarAd } from './models';

const PAGE_SIZE = 100;
const BASE_CAR_API = 'rest/car';
const BASE_CAR_QUERY = 'isPriced=true&vatDeduct=true&taxFree';
const COUNT_API = `${BASE_CAR_API}/search-count`;
const SEARCH_API = `${BASE_CAR_API}/search`;

// Configure exponential back-off retry delay between requests
axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

const { carAPI } = Configuration;

/**
 * Count Response
 */
export interface ICountResponse {
  total: number;
}

/**
 * Get cars params
 */
interface IGetCarsParams {
  fromDate: DateTime;
  status?: 'sold' | 'forsale';
  toDate?: DateTime;
}

/**
 * Get cars by params
 */
export const getCars = async ({ fromDate, toDate, status = 'forsale' }: IGetCarsParams): Promise<CarAd[]> => {
  const count = await getCount({ fromDate, toDate, status });
  const pages = Math.ceil(count / PAGE_SIZE);
  console.log(`${pages} pages of ${status} cars (${count}) to be saved.`);
  if (!count) return [];

  // Get cars from all pages in parallel
  const searchPromises = [];
  for (let page = 1; page <= pages; page++) {
    searchPromises.push(searchCarAds({ page, fromDate, toDate, status }));
  }
  const results = await Promise.all(searchPromises);
  return ([] as CarAd[]).concat(...results);
};

/**
 * Search params
 */
interface ISearchParams extends IGetCarsParams {
  page: number;
}

/**
 * Search car ads
 */
const searchCarAds = async ({ fromDate, toDate, page, status }: ISearchParams) => {
  const carAds = await axios
    .get<CarAd[]>(
      `${
        carAPI.url
      }/${SEARCH_API}?${BASE_CAR_QUERY}&page=${page}&rows=${PAGE_SIZE}&sortBy=dateCreated&sortOrder=asc&status=${status}&dateCreatedFrom=${fromDate.toISO()}${
        toDate ? '&dateCreatedTo=' + toDate.toISO() : ''
      }`,
    )
    .then((x) => x.data);

  return carAds;
};

/**
 * Get count for the search results
 */
const getCount = async ({ fromDate, toDate, status }: IGetCarsParams): Promise<number> => {
  return await axios
    .get<ICountResponse>(
      `${carAPI.url}/${COUNT_API}?${BASE_CAR_QUERY}&status=${status}&dateCreatedFrom=${fromDate.toISO()}${
        toDate ? '&dateCreatedTo=' + toDate.toISO() : ''
      }`,
    )
    .then((x) => x.data.total);
};

/**
 * Auth response
 */
export interface IAuthResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token: string;
}

/**
 * Authenticate to API
 *
 */
export const authenticate = async () => {
  console.log('Authenticating');
  await axios
    .post<IAuthResponse>(
      `${carAPI.auth_url}/oauth2/token`,
      qs.stringify({
        grant_type: 'password',
        email: carAPI.user,
        password: carAPI.secret,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )
    .then((x) => {
      const token = x.data.access_token;
      // Add the token to default request headers
      axios.defaults.headers = {
        'X-Access-Token': token,
      };
    })
    .then(() => console.log('Authentication ok ????'));
};
