import { Request, Response, NextFunction } from 'express';
import { User } from '../modules/auth/auth.model.js';
import { AuthService } from '../modules/auth/auth.service.js';
import { ApiError } from '../utils/ApiError.js';
import { StatusCodes } from '../constants/index.js';

/**
 * Auth middleware that:
 * 1. Extracts JWT from Authorization header
 * 2. Verifies and decodes the token
 * 3. Fetches the user from DB (role from DB, NEVER from token alone)
 * 4. Attaches the full user document to req.user
 */
export const authGuard = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, 'Authentication required');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, 'Authentication required');
        }

        // Decode token — only used to get user ID
        const decoded = AuthService.verifyToken(token);

        // Fetch fresh user from DB — role comes from DB, not token
        const user = await User.findById(decoded.id);
        if (!user || !user.isActive) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, 'User not found or inactive');
        }

        // Attach full user document to request
        req.user = user;
        next();
    } catch (error) {
        if (error instanceof ApiError) {
            next(error);
        } else {
            next(new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid or expired token'));
        }
    }
};
