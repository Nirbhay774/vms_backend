import { Request, Response, NextFunction } from 'express';
import { AuditService } from './audit.service.js';
import { StatusCodes } from '../../constants/index.js';

export class AuditController {
    static async getLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;

            const filter: any = {};
            if (req.query.resource) filter.resource = req.query.resource;
            if (req.query.resourceId) filter.resourceId = req.query.resourceId;
            if (req.query.user) filter.user = req.query.user;
            if (req.query.action) filter.action = req.query.action;

            const { logs, total } = await AuditService.getLogs(filter, page, limit);

            res.status(StatusCodes.OK).json({
                success: true,
                data: { logs, total, page, limit },
            });
        } catch (error) {
            next(error);
        }
    }
}
