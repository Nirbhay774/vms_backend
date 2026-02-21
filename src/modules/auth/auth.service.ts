import { User, IUser } from './auth.model.js';
import jwt from 'jsonwebtoken';
import { config } from '../../configs/env.config.js';
import { UserRole } from '../../constants/index.js';

interface TokenPayload {
    id: string;
    role: UserRole;
}

export class AuthService {
    /**
     * Register a new user.
     * Role is ALWAYS set server-side — never trusted from the frontend.
     */
    static async register(userData: Partial<IUser>): Promise<IUser> {
        const user = new User({
            name: userData.name,
            email: userData.email,
            password: userData.password,
            role: UserRole.VENDOR, // Default role, never from request body
        });
        await user.save();
        return user;
    }

    /**
     * Find user by email (includes password for comparison).
     */
    static async findByEmail(email: string): Promise<IUser | null> {
        return User.findOne({ email }).select('+password');
    }

    /**
     * Generate JWT with id and role. Token expires in 1 day.
     */
    static generateToken(userId: string, role: UserRole): string {
        const payload: TokenPayload = { id: userId, role };
        return jwt.sign(payload, config.jwtSecret, { expiresIn: '1d' });
    }

    /**
     * Verify and decode a JWT token.
     */
    static verifyToken(token: string): TokenPayload {
        return jwt.verify(token, config.jwtSecret) as TokenPayload;
    }
}
