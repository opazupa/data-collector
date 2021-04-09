import { Handler } from 'aws-lambda';
import AWS from 'aws-sdk';
import axios from 'axios';

import { Configuration } from './configuration';
import { Hello } from './models/hello';
import { wrapHandler } from './utils/sentry';

const { aws, carAPI } = Configuration;

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

export const getCars: Handler = async () => {
  const token = await getToken();

  const results = [];
  for (let index2 = 0; index2 < 1; index2++) {
    const arr: Promise<number>[] = [];
    for (let index = 0; index < 1; index++) {
      arr.push(searchCars(token));
    }
    const s = await Promise.all(arr);
    results.push(...s);
    console.log(s.reduce((a, b) => a + b));
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log(results.length);
  console.log(results.reduce((a, b) => a + b));
  const response = {
    statusCode: 200,
    body: 'Ok',
  };

  return new Promise((resolve) => {
    resolve(response);
  });
};

const searchCars = async (token: string) => {
  const json = await axios
    .get(
      `${carAPI.url}/rest/car/search?page=1&rows=100&sortBy=dateCreated&sortOrder=asc&latitude=60.5346&longitude=25.6074&isMyFavorite=false&make=230&includeMakeModel=true&accessoriesCondition=and&isPriced=true&vatDeduct=true&taxFree=false&kilometersTo=8000&tagsCondition=and&isAdDealerExchange=false`,
      {
        headers: {
          'X-Access-Token': token,
        },
      },
    )
    .then((x) => x.data)
    // .then((x) => console.log(x))
    .then(() => 1)
    .catch(() => 0);

  return json;
};

const getToken = async (): Promise<string> => {
  const token = await axios
    .post(`${carAPI.url}/oauth2/token`, {
      grant_type: 'password',
      email: carAPI.user,
      password: carAPI.secret,
    })
    .then((x) => x.data.token);

  console.log(token);

  return token;
};

export const getBucket = (): void => {
  // Create S3 service object
  const s3 = new AWS.S3({
    region: aws.region,
    endpoint: aws.url,
    accessKeyId: aws.accessKey,
    secretAccessKey: aws.accessSecret,
  });

  // Call S3 to list the buckets
  s3.listBuckets(function (err, data) {
    if (err) {
      console.log('Error', err);
    } else {
      console.log('Success', data.Buckets);
    }
  });
};
