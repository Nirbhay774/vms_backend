import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { StatusCodes } from '../constants/index.js';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
    let { statusCode, message } = err;

    if (!(err instanceof ApiError)) {
        statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
        message = err.message || 'Internal Server Error';
    }

    res.locals.errorMessage = err.message;

    const response = {
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    };

    if (process.env.NODE_ENV === 'development') {
        console.error(err);
    }

    res.status(statusCode).send(response);
};
