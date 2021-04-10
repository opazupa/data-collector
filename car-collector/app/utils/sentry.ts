import * as Sentry from '@sentry/serverless';

import { Configuration } from '../configuration';

const { sentry } = Configuration;

Sentry.AWSLambda.init({
  dsn: sentry.dsn,
  environment: sentry.env,
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

export const wrapHandler = Sentry.AWSLambda.wrapHandler;
