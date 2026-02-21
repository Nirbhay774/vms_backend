import { Vendor, IVendor } from './vendor.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { StatusCodes } from '../../constants/index.js';
import { AuditService } from '../audit/audit.service.js';

export class VendorService {
    static async createVendor(vendorData: Partial<IVendor>): Promise<IVendor> {
        const existingVendor = await Vendor.findOne({
            $or: [{ email: vendorData.email }, { taxId: vendorData.taxId }],
        });

        if (existingVendor) {
            throw new ApiError(StatusCodes.CONFLICT, 'Vendor with this email or Tax ID already exists');
        }

        const vendor = new Vendor(vendorData);
        await vendor.save();

        await AuditService.logAction({
            action: 'VENDOR_CREATED',
            resource: 'Vendor',
            resourceId: vendor._id.toString(),
            user: vendorData.createdBy?.toString() || '',
            newState: vendor.toObject(),
        });

        return vendor;
    }

    static async getAllVendors(page = 1, limit = 10): Promise<{ vendors: IVendor[]; total: number }> {
        const skip = (page - 1) * limit;
        const [vendors, total] = await Promise.all([
            Vendor.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
            Vendor.countDocuments(),
        ]);
        return { vendors, total };
    }

    static async getVendorById(id: string): Promise<IVendor> {
        const vendor = await Vendor.findById(id);
        if (!vendor) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Vendor not found');
        }
        return vendor;
    }

    static async updateVendor(id: string, updateData: Partial<IVendor>, userId: string): Promise<IVendor> {
        const oldVendor = await Vendor.findById(id);
        if (!oldVendor) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Vendor not found');
        }

        const vendor = await Vendor.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!vendor) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Vendor not found');
        }

        await AuditService.logAction({
            action: 'VENDOR_UPDATED',
            resource: 'Vendor',
            resourceId: id,
            user: userId,
            oldState: oldVendor.toObject(),
            newState: vendor.toObject(),
        });

        return vendor;
    }

    static async deleteVendor(id: string): Promise<void> {
        const vendor = await Vendor.findByIdAndUpdate(id, { status: 'INACTIVE' });
        if (!vendor) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Vendor not found');
        }
    }
}
