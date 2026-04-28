import { Router } from 'express';

import authenticate from '../middlewares/auth.middleware.js';
import getTimestamp from '../utils/getTimestamp.util.js';

const demoRouter = Router();

async function demoController(req, res) {
  console.info(`${getTimestamp()} Request Intercepted at ${req.originalUrl}, sending response.`);
  return res.status(200).json({
    message: 'Successful Request! ',
  });
}

demoRouter.get('/noAuthDemo', demoController);
demoRouter.post('/authDemo', authenticate, demoController);

export default demoRouter;
