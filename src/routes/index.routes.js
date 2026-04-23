import { Router } from 'express';
import authenticate from '../middlewares/auth.middleware.js';

const apiRouter = Router();

import infoRouter from './info.routes.js';
apiRouter.use('/info', authenticate, infoRouter);

import userRouter from './user.routes.js';
apiRouter.use('/user', userRouter);

import urlRouter from './url.routes.js';
apiRouter.use('/url', urlRouter);

export default apiRouter;
