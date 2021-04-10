import axios from 'axios';
import { DateTime } from 'luxon';
import qs from 'qs';

import { Configuration } from '../../configuration';
import { CarAd } from './models';

const PAGE_SIZE = 100;
const BASE_CAR_API = 'rest/car';
const BASE_CAR_QUERY = 'isPriced=true&vatDeduct=true&taxFree';

const { carAPI } = Configuration;

/**
 * Count Response
 */
interface ICountResponse {
  total: number;
}

/**
 * Get cars params
 */
interface IGetCarsParams {
  fromDate: DateTime;
}

/**
 * Get cars by params
 */
export const getCars = async ({ fromDate }: IGetCarsParams): Promise<CarAd[]> => {
  // Handle API auth once
  await authenticate();

  const count = await getCount({ fromDate });
  const pages = Math.ceil(count / PAGE_SIZE);

  console.log(`${pages} pages of new cars (${count}) to be saved.`);

  // Get cars from all pages in parallel
  const searchPromises = [];
  for (let page = 1; page <= pages; page++) {
    searchPromises.push(searchCarAds({ page, fromDate }));
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
const searchCarAds = async ({ fromDate, page }: ISearchParams) => {
  const carAds = await axios
    .get<CarAd[]>(
      `${
        carAPI.url
      }/${BASE_CAR_API}/search?${BASE_CAR_QUERY}&page=${page}&rows=${PAGE_SIZE}&sortBy=dateCreated&sortOrder=asc${
        fromDate ? '&dateCreatedFrom=' + fromDate.toISO() : ''
      }`,
    )
    .then((x) => x.data);

  return carAds;
};

/**
 * Get count for the search results
 */
const getCount = async ({ fromDate }: IGetCarsParams): Promise<number> => {
  return await axios
    .get<ICountResponse>(
      `${carAPI.url}/${BASE_CAR_API}/search-count?${BASE_CAR_QUERY}&dateCreatedFrom=${fromDate.toISO()}`,
    )
    .then((x) => x.data.total);
};

/**
 * Auth response
 */
interface IAuthResponse {
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
const authenticate = async () => {
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
    .then(() => console.log('Authentication ok 👍'));
};