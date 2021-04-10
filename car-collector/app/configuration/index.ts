import * as dotenv from 'dotenv';

const DEVELOPMENT = 'dev';

/**
 * Env configuration interface
 *
 * @interface IConfiguration
 */
interface IConfiguration {
  isDev: () => boolean;
  aws: {
    region: string;
    url: string;
    accessKey: string;
    accessSecret: string;
    carBucket: string;
  };
  carAPI: {
    url: string;
    auth_url: string;
    user: string;
    secret: string;
  };
  sentry: {
    dsn: string;
    env: string;
  };
}

// Apply .env
dotenv.config();

/**
 * Env configuration
 *
 * @interface IConfiguration
 */
export const Configuration: IConfiguration = {
  isDev: () => (process.env.APP_ENV as string) === DEVELOPMENT,
  aws: {
    url: process.env.AWS_S3_URL as string,
    region: process.env.AWS_S3_REGION as string,
    accessKey: process.env.AWS_S3_ACCESS_KEY as string,
    accessSecret: process.env.AWS_S3_ACCESS_SECRET as string,
    carBucket: process.env.AWS_S3_CAR_BUCKET as string,
  },
  carAPI: {
    auth_url: process.env.NETTIAUTO_API_AUTH_URL as string,
    url: process.env.NETTIAUTO_API_URL as string,
    user: process.env.NETTIAUTO_API_USER as string,
    secret: process.env.NETTIAUTO_API_SECRET as string,
  },
  sentry: {
    dsn: process.env.SENTRY_DSN as string,
    env: (process.env.SENTRY_ENV || process.env.NODE_ENV) as string,
  },
};
