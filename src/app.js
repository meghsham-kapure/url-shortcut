import express from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yaml';
import cookieParser from 'cookie-parser';
import { readFile } from 'fs/promises';
import errorHandler from './middlewares/error.middleware.js';
import apiRouter from './routes/index.routes.js';

const apiSpecYaml = await readFile('src/api-spec/api-spec.yaml', 'utf8');
const apiSpecJson = yaml.parse(apiSpecYaml);

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/url-shortcut/api/v1/info/docs', swaggerUi.serve, swaggerUi.setup(apiSpecJson));

app.use('/url-shortcut/api/v1', apiRouter);

app.use(errorHandler);

export default app;
