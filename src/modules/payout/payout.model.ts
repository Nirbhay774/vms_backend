import mongoose, { Schema, Document } from 'mongoose';
import { PayoutStatus } from '../../constants/index.js';

export interface IPayout extends Document {
    vendor: mongoose.Types.ObjectId;
    amount: number;
    currency: string;
    status: PayoutStatus;
    description?: string;
    rejectionReason?: string;
    createdBy: mongoose.Types.ObjectId;
    approvedBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const payoutSchema = new Schema<IPayout>(
    {
        vendor: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
        amount: { type: Number, required: true, min: [0, 'Amount must be positive'] },
        currency: { type: String, default: 'USD', uppercase: true },
        status: { type: String, enum: Object.values(PayoutStatus), default: PayoutStatus.PENDING },
        description: { type: String, trim: true },
        rejectionReason: { type: String, trim: true },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

// Index for performance
payoutSchema.index({ vendor: 1, status: 1 });

export const Payout = mongoose.model<IPayout>('Payout', payoutSchema);
