import express from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yaml';
import { readFile } from 'fs/promises';

import apiRouter from './routes/index.routes.js';

const apiSpecYaml = await readFile('src/api-spec/api-spec.yaml', 'utf8');
const apiSpecJson = yaml.parse(apiSpecYaml);

const app = express();

app.use(express.json());

app.use('/url-shortcut/api/docs', swaggerUi.serve, swaggerUi.setup(apiSpecJson));

app.use('/url-shortcut/api/v1', apiRouter);

export default app;
