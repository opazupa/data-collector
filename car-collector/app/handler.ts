import { Handler } from 'aws-lambda';
import AWS from 'aws-sdk';
import axios from 'axios';

import { Hello } from './models/hello';

export const hello: Handler = (event: unknown) => {
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
};

export const getCars: Handler = async () => {
  const results = [];
  for (let index2 = 0; index2 < 5; index2++) {
    const arr: Promise<number>[] = [];
    for (let index = 0; index < 25; index++) {
      arr.push(getModels());
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

const getModels = async () => {
  const json = await axios
    .get(
      'https://api.nettix.fi/rest/car/search?page=1&rows=100&sortBy=dateCreated&sortOrder=asc&latitude=60.5346&longitude=25.6074&isMyFavorite=false&make=230&includeMakeModel=true&accessoriesCondition=and&isPriced=true&vatDeduct=true&taxFree=false&kilometersTo=8000&tagsCondition=and&isAdDealerExchange=false',
      {
        headers: {
          'X-Access-Token':
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpZCI6ImNlMTY5ZmI3YTFhMmU0MWIwZDgyYjU0ODQ0YWEzNzI2ODViOWRjYTUiLCJqdGkiOiJjZTE2OWZiN2ExYTJlNDFiMGQ4MmI1NDg0NGFhMzcyNjg1YjlkY2E1IiwiaXNzIjoiIiwiYXVkIjoiYW5vbnltb3VzIiwic3ViIjoiMjI3NDgzNyIsImV4cCI6MTYxNzY0MTc1NSwiaWF0IjoxNjE3NjM4MTU1LCJ0b2tlbl90eXBlIjoiYmVhcmVyIiwic2NvcGUiOiJyZWFkIHdyaXRlLXVzZXIiLCJ1c2VyX2dyb3VwIjoidXNlciIsImVtYWlsIjoib3NhYXJpbmU5M0BnbWFpbC5jb20iLCJuYW1lIjoiT2xsaSBTYWFyaW5lbiIsIm5ldHRpeF9pZCI6MjI3NDgzN30.Lo_HEpnyMu6sPc4p7CMkPQDLfp3yuvAHLEHXl3dOfipTm1tr4CvM-10Ms3hxfjKHQkBEZg1mJi8NGmaZxC1-A_R67tTgDMUZ5E4rUWvjvirhmwlr9whNjFZ0-sy0mUGw7hTr69IMY8KH9Ycm2e4j3BwRrDksmZTOU2Yn9M2bGwbv3ekAOweZzX5a89hPFJzqh9vK-XMqlqxemAKb2fCISbbZ4zSVq71Lq4OX0l3n2kff97FRAqrYcTkSiwmkn7PeTgeb52_i7BRKihuL_hVZadqHFnfefi6lQCW1f1949eSOOyNy6YVIBDDOhG-bXdntfNriigtjyKL7cpApnoII4A',
        },
      },
    )
    .then((x) => x.data)
    // .then((x) => console.log(x))
    .then(() => 1)
    .catch(() => 0);

  return json;
};

export const getBucket = (): void => {
  AWS.config.update({ region: 'REGION' });

  // Create S3 service object
  const s3 = new AWS.S3({ apiVersion: '2006-03-01', endpoint: 'http://s3:9000' ,accessKeyId: 'test', secretAccessKey: 'testtest' });

  // Call S3 to list the buckets
  s3.listBuckets(function (err, data) {
    if (err) {
      console.log('Error', err);
    } else {
      console.log('Success', data.Buckets);
    }
  });
};
