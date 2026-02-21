import { Request, Response, NextFunction } from 'express';
import { UserRole, StatusCodes } from '../constants/index.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Role-based access control middleware.
 * Must be used AFTER authGuard — relies on req.user being set.
 * Role is read from req.user (fetched from DB), never from the token or request body.
 */
export const requireRole = (...roles: UserRole[]) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        if (!req.user) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, 'Authentication required');
        }
        console.log("req.user.role", req.user.role)
        if (!roles.includes(req.user.role)) {
            throw new ApiError(StatusCodes.FORBIDDEN, 'Access denied: insufficient permissions');
        }

        next();
    };
};
