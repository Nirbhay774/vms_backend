import { Request, Response, NextFunction } from 'express';
import { PayoutService } from './payout.service.js';
import { StatusCodes, UserRole } from '../../constants/index.js';

export class PayoutController {
    static async createDraft(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = req.user as any;
            const payout = await PayoutService.createDraft(req.body, user._id, user.role);
            res.status(StatusCodes.CREATED).json({
                success: true,
                message: 'Payout draft created successfully',
                data: payout,
            });
        } catch (error) {
            next(error);
        }
    }

    static async submitPayout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = req.user as any;
            const payout = await PayoutService.submitPayout(req.params.id, user._id, user.role);
            res.status(StatusCodes.OK).json({
                success: true,
                message: 'Payout submitted successfully',
                data: payout,
            });
        } catch (error) {
            next(error);
        }
    }

    static async approvePayout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = req.user as any;
            const payout = await PayoutService.approvePayout(req.params.id, user._id, user.role);
            res.status(StatusCodes.OK).json({
                success: true,
                message: 'Payout approved successfully',
                data: payout,
            });
        } catch (error) {
            next(error);
        }
    }

    static async rejectPayout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = req.user as any;
            const { reason } = req.body;
            const payout = await PayoutService.rejectPayout(req.params.id, reason, user._id, user.role);
            res.status(StatusCodes.OK).json({
                success: true,
                message: 'Payout rejected successfully',
                data: payout,
            });
        } catch (error) {
            next(error);
        }
    }

    static async getPayouts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = req.user as any;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            let filter: any = {};

            if (user.role === UserRole.VENDOR) {
                filter.createdBy = user._id;
            } else if (req.query.vendorId) {
                filter.vendor = req.query.vendorId;
            }

            if (req.query.status) {
                filter.status = req.query.status;
            }

            const { payouts, total } = await PayoutService.getPayouts(filter, page, limit);
            res.status(StatusCodes.OK).json({
                success: true,
                data: { payouts, total, page, limit },
            });
        } catch (error) {
            next(error);
        }
    }
}
