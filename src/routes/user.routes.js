import { Router } from 'express';
import { validate } from './../middlewares/validate.middleware.js';
import { userRegistration, userLogin } from '../controllers/user.controller.js';
import {
  registerUserRequestSchema,
  loginUserRequestSchema,
} from './../validations/user.validation.js';

const userRouter = Router();

userRouter.post('/register', validate(registerUserRequestSchema), userRegistration);

userRouter.post('/login', validate(loginUserRequestSchema), userLogin);

export default userRouter;
