import { Router } from 'express';
import { helthcheckController } from './../controllers/info.controller.js';

const infoRouter = Router();

infoRouter.route('/helthcheck').get(helthcheckController);

export default infoRouter;
