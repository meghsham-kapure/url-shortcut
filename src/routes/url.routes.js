import { Router } from 'express';
import { validate } from '../middlewares/validate.middleware.js';
import { createShortcutRequestSchema } from './../validations/url.validations.js';
import {
  createShortcut,
  // getAllUsersUrls,
  // redirectToOriginalUrl,
} from '../controllers/url.controller.js';
import authenticate from '../middlewares/auth.middleware.js';
import getTimestamp from '../utils/getTimestamp.util.js';

const urlRouter = Router();


// urlRouter.get('/', authenticate, getAllUsersUrls);

urlRouter.post(
  '/createShortcut',
  authenticate,
  validate(createShortcutRequestSchema),
  createShortcut
);
// urlRouter.get('/:shortcut', redirectToOriginalUrl);

export default urlRouter;


