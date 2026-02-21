import { Request, Response, NextFunction } from 'express';
import { DashboardService } from './dashboard.service.js';
import { StatusCodes } from '../../constants/index.js';

export class DashboardController {
    static async getStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const stats = await DashboardService.getStats();
            res.status(StatusCodes.OK).json({
                success: true,
                message: 'Dashboard statistics retrieved successfully',
                data: stats,
            });
        } catch (error) {
            next(error);
        }
    }
}
