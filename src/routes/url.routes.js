import { Router } from 'express';

import { shortenUrl, getAllUsersUrls } from '../controllers/url.controller.js';
import authenticate from '../middlewares/auth.middleware.js';
import getTimestamp from '../utils/getTimestamp.util.js';

const urlRouter = Router();

urlRouter.get('/', authenticate, getAllUsersUrls);
urlRouter.post('/shorten', authenticate, shortenUrl);

export default urlRouter;


