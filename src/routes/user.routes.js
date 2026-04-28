import { Router } from 'express';
import { validate } from './../middlewares/validate.middleware.js';
import { userRegistration, userLogin, userLogout } from '../controllers/user.controller.js';
import {
  registerUserRequestSchema,
  loginUserRequestSchema,
} from './../validations/user.validation.js';
import authenticate from './../middlewares/auth.middleware.js';

const userRouter = Router();

userRouter.post('/register', validate(registerUserRequestSchema), userRegistration);

userRouter.post('/login', validate(loginUserRequestSchema), userLogin);

userRouter.post('/logout', authenticate, userLogout);

export default userRouter;
