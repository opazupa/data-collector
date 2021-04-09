import axios from 'axios';
import { DateTime } from 'luxon';
import qs from 'qs';

import { Configuration } from '../configuration';

const { carAPI } = Configuration;
const PAGE_SIZE = 100;
const CAR_API_BASE = 'rest/car';
/**
 * Car option
 *
 * @interface CarOption
 */
interface CountResponse {
  total: number;
}

export const getNewCars = async () => {
  await authenticate();
  const yesterday = DateTime.utc().plus({ days: -1 }).toISO();
  const count = await axios
    .get<CountResponse>(
      `${carAPI.url}/${CAR_API_BASE}/search-count?isPriced=true&vatDeduct=true&taxFree=false&dateCreatedFrom=${yesterday}`,
    )
    .then((x) => x.data.total);

  const pages = count / PAGE_SIZE;

  console.log(`${Math.ceil(pages)} pages of new cars (${count}) to be saved.`);
  const carsPromises = [];

  // TODO
  for (let page = 1; page <= Math.ceil(pages); page++) {
    carsPromises.push(searchCarAds({ page, fromDate: yesterday }));
  }
  const results = await Promise.all(carsPromises);

  return ([] as CarAd[]).concat(...results);
};

/**
 * Car option
 *
 * @interface CarOption
 */
interface CarOption {
  id: number;
  fi: string;
  en: string;
}

/**
 * Car ad
 *
 * @interface CarAd
 */
interface CarAd {
  status: 'forsale' | 'onhold' | 'sold' | 'expired' | 'removed';
  id: string;
  adUrl: string;
  userId: number;
  userName: string;
  postedBy: string;
  dateCreated: Date;
  dateUpdated: Date;
  lastModified: Date;
  vehicleType: CarOption;
  make: CarOption;
  model: CarOption;
  modelType?: CarOption;
  bodyType: CarOption;
  color: CarOption;
  colorType: CarOption;
  fuelType: CarOption;
  driveType: CarOption;
  gearType: CarOption;
  country: CarOption;
  region: CarOption;
  town: CarOption;
  accessories: CarOption[];
  year: number;
  modelTypeName: string;
  vin?: string;
  firstRegistrationMonth?: number;
  firstRegistrationYear?: number;
  roadWorthy: boolean;
  lastInspectionMonth?: number;
  lastInspectionYear?: number;
  tooNewForInspections: boolean;
  price: number;
  isPriced: boolean;
  taxFree: boolean;
  vatDeduct: boolean;
  registerNumber: string;
  showRegisterNumber: boolean;
  totalOwners?: number;
  description: string;
  showPostingDate: boolean;
  kilometers: number;
  engineSize: number;
  seats: number;
  doors: number;
  steeringWheelLeft: boolean;
  power: number;
  powerUnitIsKw: boolean;
  batteryCapacity?: string;
  electricRange?: string;
  torque?: string;
  co2Emission: number;
  topSpeed: number;
  acceleration: number;
  consumptionUrban?: number;
  consumptionRoad?: number;
  consumptionCombined: number;
}

// export const getCars = async () => {
//   // Authenticate
//   await authenticate();

//   const results = [];
//   for (let index2 = 0; index2 < 1; index2++) {
//     const arr: Promise<number>[] = [];
//     for (let index = 0; index < 1; index++) {
//       arr.push(searchCars(token));
//     }
//     const s = await Promise.all(arr);
//     results.push(...s);
//     console.log(s.reduce((a, b) => a + b));
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//   }

//   console.log(results.length);
//   console.log(results.reduce((a, b) => a + b));
//   const response = {
//     statusCode: 200,
//     body: 'Ok',
//   };

//   return new Promise((resolve) => {
//     resolve(response);
//   });
// };

interface ISearchParams {
  fromDate?: string;
  page: number;
}

const searchCarAds = async ({ fromDate, page }: ISearchParams) => {
  const carAds = await axios
    .get<CarAd[]>(
      `${
        carAPI.url
      }/${CAR_API_BASE}/search?page=${page}&rows=100&sortBy=dateCreated&sortOrder=asc&isPriced=true&vatDeduct=true&taxFree=false${
        fromDate ? '&dateCreatedFrom=' + fromDate : ''
      }`,
    )
    .then((x) => x.data);

  return carAds;
};

interface AuthResponse {
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
    .post<AuthResponse>(
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
    });
};
