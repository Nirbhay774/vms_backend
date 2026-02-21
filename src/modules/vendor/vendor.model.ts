import mongoose, { Schema, Document } from 'mongoose';

export enum VendorStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export interface IVendor extends Document {
    name: string;
    email: string;
    bankDetails: {
        accountName: string;
        accountNumber: string;
        bankName: string;
        ifscCode: string;
    };
    taxId: string;
    status: VendorStatus;
    createdBy: mongoose.Types.ObjectId;
}

const vendorSchema = new Schema<IVendor>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        bankDetails: {
            accountName: { type: String, required: true },
            accountNumber: { type: String, required: true },
            bankName: { type: String, required: true },
            ifscCode: { type: String, required: true },
        },
        taxId: { type: String, required: true, unique: true, uppercase: true, trim: true },
        status: { type: String, enum: Object.values(VendorStatus), default: VendorStatus.ACTIVE },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

export const Vendor = mongoose.model<IVendor>('Vendor', vendorSchema);
