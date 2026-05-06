import express from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import mongoose from 'mongoose';
import path from 'path';
import router from './routes';
import notFoundHandler from './middlewares/not-found';
import { errorLogger, requestLogger } from './middlewares/logger';
import errorHandler from './middlewares/error-handler';
import { DB_ADDRESS, PORT } from './config';

export const app = express();
export const port = PORT;

mongoose.connect(DB_ADDRESS);

app.use(cors());
app.use('/images', express.static(path.join(__dirname, '../public/images')));
app.use(express.json());
app.use(requestLogger);
app.use(router);
app.use(notFoundHandler);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${port}. DB: ${DB_ADDRESS}`);
});
