import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service.js';
import { ApiError } from '../../utils/ApiError.js';
import { StatusCodes, ErrorMessages } from '../../constants/index.js';

export class AuthController {
    /**
     * POST /auth/register
     * Register a new user. Role is set server-side (default: VENDOR).
     */
    static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { name, email, password } = req.body;

            const existingUser = await AuthService.findByEmail(email);
            if (existingUser) {
                throw new ApiError(StatusCodes.BAD_REQUEST, ErrorMessages.USER_EXISTS);
            }

            // Role is intentionally NOT taken from req.body
            const user = await AuthService.register({ name, email, password });
            const token = AuthService.generateToken(user._id.toString(), user.role);

            res.status(StatusCodes.CREATED).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    user: { id: user._id, name: user.name, email: user.email, role: user.role },
                    token,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /auth/login
     * Validate credentials, compare bcrypt password, return JWT.
     */
    static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body;

            const user = await AuthService.findByEmail(email);
            if (!user || !(await user.comparePassword(password))) {
                throw new ApiError(StatusCodes.UNAUTHORIZED, ErrorMessages.INVALID_CREDENTIALS);
            }

            if (!user.isActive) {
                throw new ApiError(StatusCodes.FORBIDDEN, 'Account is deactivated');
            }

            const token = AuthService.generateToken(user._id.toString(), user.role);

            res.status(StatusCodes.OK).json({
                success: true,
                message: 'Login successful',
                data: {
                    user: { id: user._id, name: user.name, email: user.email, role: user.role },
                    token,
                },
            });
        } catch (error) {
            next(error);
        }
    }
}
