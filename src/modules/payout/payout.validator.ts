import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../../utils/ApiError.js';
import { StatusCodes } from '../../constants/index.js';

export class PayoutValidator {
    static validateCreateDraft(req: Request, _res: Response, next: NextFunction): void {
        const { vendor, amount } = req.body;

        if (!vendor || !amount) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Vendor ID and amount are required');
        }

        if (isNaN(amount) || amount <= 0) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Amount must be a positive number');
        }

        next();
    }

    static validateRejectPayout(req: Request, _res: Response, next: NextFunction): void {
        const { reason } = req.body;

        if (!reason || typeof reason !== 'string' || reason.trim() === '') {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'A valid reason is mandatory for rejection');
        }

        next();
    }
}
