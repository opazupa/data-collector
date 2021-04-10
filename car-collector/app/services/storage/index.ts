import AWS from 'aws-sdk';
import { DateTime } from 'luxon';
import { gzip } from 'node-gzip';

import { Configuration } from '../../configuration';
import { toCar } from '../../models';
import { CarAd } from '../cars';

const { aws } = Configuration;

// Create S3 service object
const s3 = new AWS.S3({
  region: aws.region,
  endpoint: `${aws.url}/${aws.carBucket}`,
  accessKeyId: aws.accessKey,
  secretAccessKey: aws.accessSecret,
  s3BucketEndpoint: true,
});

export const save = async (data: CarAd[], dateInfo: DateTime = DateTime.utc()) => {
  // Partitions
  const partition = `year=${dateInfo.year}/week=${dateInfo.weekNumber}`;
  const fileName = `${dateInfo.weekdayLong}.json.gz`;

  // Upload parameters
  const params = {
    Bucket: aws.carBucket,
    Key: `${partition}/${fileName}`,
    Body: await gzip(data.map((d) => JSON.stringify(toCar(d))).join('\n')),
  } as AWS.S3.PutObjectRequest;

  // Upload file to the bucket
  await s3
    .putObject(params)
    .promise()
    .then(() => console.log(`Uploaded ${partition}/${fileName} to ${aws.carBucket} 🚀`));
};
