import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../../utils/ApiError.js';
import { StatusCodes } from '../../constants/index.js';

export class VendorValidator {
    static validateCreateVendor(req: Request, _res: Response, next: NextFunction): void {
        const { name, email, bankDetails, taxId } = req.body;

        if (!name || !email || !bankDetails || !taxId) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Missing required fields: name, email, bankDetails, taxId');
        }

        const { accountName, accountNumber, bankName, ifscCode } = bankDetails;
        if (!accountName || !accountNumber || !bankName || !ifscCode) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Incomplete bank details');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid email format');
        }

        next();
    }

    static validateUpdateVendor(req: Request, _res: Response, next: NextFunction): void {
        if (Object.keys(req.body).length === 0) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Update body cannot be empty');
        }
        next();
    }
}
