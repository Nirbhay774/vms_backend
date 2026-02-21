import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from '../../constants/index.js';
import { ApiError } from '../../utils/ApiError.js';

export class AuthValidator {
    static validateRegister(req: Request, _res: Response, next: NextFunction): void {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Name, email, and password are required');
        }

        if (typeof name !== 'string' || name.trim().length < 2) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Name must be at least 2 characters');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid email format');
        }

        if (typeof password !== 'string' || password.length < 6) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Password must be at least 6 characters');
        }

        // Strip role from body — role must NEVER be set from the frontend
        delete req.body.role;

        next();
    }

    static validateLogin(req: Request, _res: Response, next: NextFunction): void {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Email and password are required');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid email format');
        }

        next();
    }
}
