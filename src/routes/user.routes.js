import { Router } from 'express';
import { validate } from './../middlewares/validate.middleware.js';
import { userRegistration, userLogin, userLogout } from '../controllers/user.controller.js';
import {
  registerUserRequestSchema,
  loginUserRequestSchema,
} from './../validations/user.validation.js';
import authenticate from './../middlewares/auth.middleware.js';
import HTTP_STATUS from '../utils/httpStatus.util.js';
import getResponseForUnimplementedApi from './../utils/getResponseForUnimplementedApi.util.js';

const userRouter = Router();

userRouter.post('/register', validate(registerUserRequestSchema), userRegistration);

userRouter.post('/login', validate(loginUserRequestSchema), userLogin);

userRouter.post('/logout', authenticate, (req,res)=> getResponseForUnimplementedApi ); //userLogout
userRouter.post('/logout/:sessionId', (req,res)=> getResponseForUnimplementedApi); //logoutBySessionId

userRouter.get('/getDetails/:userId', (req,res)=> getResponseForUnimplementedApi); //getUserDetailsById
userRouter.get('/getDetails', (req,res)=> getResponseForUnimplementedApi); //getUserDetails
userRouter.get('/getSessions', (req,res)=> getResponseForUnimplementedApi); //getSessions

userRouter.post('/updateDetails', (req,res)=> getResponseForUnimplementedApi); //updateDetails

userRouter.post('/deactivatedUser', (req,res)=> getResponseForUnimplementedApi); //deactivatedUser
userRouter.post('/reactivatedUser', (req,res)=> getResponseForUnimplementedApi); //reactivatedUser

userRouter.post('/forgotPassword', (req,res)=> getResponseForUnimplementedApi); //forgotPassword
userRouter.post('/changePassword', (req,res)=> getResponseForUnimplementedApi); //changePassword

userRouter.get('/checkUsernameAvaibibily', (req,res)=> getResponseForUnimplementedApi); //checkUsernameAvaibibily
userRouter.post('/changeUsername', (req,res)=> getResponseForUnimplementedApi); //changeUsername

userRouter.post('/getEmailVerificationOtp', (req,res)=> getResponseForUnimplementedApi); //getEmailVerificationOtp
userRouter.post('/verifyAndChangeEmail', (req,res)=> getResponseForUnimplementedApi); //verifyAndChangeEmail

userRouter.post('/getPhoneVerificationOtp', (req,res)=> getResponseForUnimplementedApi); //getPhoneVerificationOtp
userRouter.post('/verifyAndChangePhone', (req,res)=> getResponseForUnimplementedApi); //verifyAndChangePhone

userRouter.post('/reportUser', (req, res) => etResponseForUnimplementedApi); //reportUser


export default userRouter;
