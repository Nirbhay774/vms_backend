import { Request, Response, NextFunction } from 'express';
import { VendorService } from './vendor.service.js';
import { StatusCodes } from '../../constants/index.js';

export class VendorController {
    static async createVendor(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = req.user as any;
            const vendorData = { ...req.body, createdBy: user._id };
            const vendor = await VendorService.createVendor(vendorData);
            res.status(StatusCodes.CREATED).json({
                success: true,
                message: 'Vendor created successfully',
                data: vendor,
            });
        } catch (error) {
            next(error);
        }
    }

    static async getAllVendors(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const { vendors, total } = await VendorService.getAllVendors(page, limit);
            res.status(StatusCodes.OK).json({
                success: true,
                data: { vendors, total, page, limit },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getVendorById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const vendor = await VendorService.getVendorById(req.params.id);
            res.status(StatusCodes.OK).json({
                success: true,
                data: vendor,
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateVendor(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = req.user as any;
            const vendor = await VendorService.updateVendor(req.params.id, req.body, user._id);
            res.status(StatusCodes.OK).json({
                success: true,
                message: 'Vendor updated successfully',
                data: vendor,
            });
        } catch (error) {
            next(error);
        }
    }

    static async deleteVendor(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await VendorService.deleteVendor(req.params.id);
            res.status(StatusCodes.OK).json({
                success: true,
                message: 'Vendor deleted successfully',
            });
        } catch (error) {
            next(error);
        }
    }
}
