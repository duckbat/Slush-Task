import { NextFunction, Request, Response } from 'express';
import CustomError from './classes/CustomError';
import { ErrorResponse } from './types/Messages';
import { TokenContent } from './types/postTypes';
import jwt from 'jsonwebtoken';


const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new CustomError(`🔍 - Not Found - ${req.originalUrl}`, 404);
  next(error);
};

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response<ErrorResponse>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  const statusCode = err.status !== 200 ? err.status || 500 : 500;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        next(new CustomError('Token missing or invalid', 401));
        return;
      }
  
      const token = authHeader.split(' ')[1];
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your_jwt_secret'
      ) as TokenContent;
  
      res.locals.user = decodedToken;
      next();
    } catch (error) {
      next(new CustomError('Token invalid', 401));
    }
  };
  

export { notFound, errorHandler, authenticate };