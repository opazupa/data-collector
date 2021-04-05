import { Handler } from 'aws-lambda';

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
