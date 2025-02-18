//App for express server
require('dotenv').config();
import express, {Request, Response} from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import { errorHandler, notFound } from './middleware';
import api from "./api"
const app = express();

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load(__dirname + '/../swagger.yaml');

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());


app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'API location: api/v1', 'swagger': '/api-docs'

  });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1', api);

app.use(notFound);
app.use(errorHandler);

export default app;