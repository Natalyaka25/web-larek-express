import type { ErrorRequestHandler } from 'express';
import HttpError from '../errors/http-error';

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  res.status(500).json({ message: 'Внутренняя ошибка сервера' });
};

export default errorHandler;
