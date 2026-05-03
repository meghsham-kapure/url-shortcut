import { Router } from 'express';

import authenticate from '../middlewares/auth.middleware.js';
import getTimestamp from '../utils/getTimestamp.util.js';
import { getEnvironmentData } from 'node:worker_threads';
import getEnvironment from '../utils/getEnvironment.util.js';
import { success } from 'zod';

const demoRouter = Router();

async function demoController(req, res) {
  console.info(`${getTimestamp()} Request Intercepted at ${req.originalUrl}, sending response.`);
  return res.status(200).json({
    message: 'Successful Request! ',
  });
}


async function demoUnhandledError(req, res) {
  const randomNumber = Math.floor(Math.random() * 10);

  try {
    if (randomNumber % 2 === 0) {
      throw new Error('Even Number Found');
    }
  } catch (error) {
    const env = getEnvironment();

    console.log('env =>' + env);

    if (env.toLocaleLowerCase().startsWith('prod'))
      return res.json({ success: false, message: 'something went wrong!' });

    return res.json({ message: error.message });
  }

  console.log(randomNumber);

  return res.json({ randomNumber });
}

demoRouter.get('/noAuthDemo', demoController);
demoRouter.post('/authDemo', authenticate, demoController);
demoRouter.get('/unhandled', demoUnhandledError);

export default demoRouter;
