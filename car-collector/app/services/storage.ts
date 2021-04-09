import AWS from 'aws-sdk';

import { Configuration } from '../configuration';

const { aws } = Configuration;

export const list = (): AWS.S3.Buckets => {
  // Create S3 service object
  const s3 = new AWS.S3({
    region: aws.region,
    endpoint: aws.url,
    accessKeyId: aws.accessKey,
    secretAccessKey: aws.accessSecret,
  });

  let buckets: AWS.S3.Buckets;
  // Call S3 to list the buckets
  s3.listBuckets(function (err, data) {
    if (err) {
      console.log('Error', err);
    } else {
      buckets = data.Buckets;
    }
  });
  return buckets;
};
