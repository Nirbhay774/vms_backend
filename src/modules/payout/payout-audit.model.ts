import mongoose, { Schema, Document } from 'mongoose';
import { PayoutStatus } from '../../constants/index.js';

export interface IPayoutAudit extends Document {
    payout: mongoose.Types.ObjectId;
    action: string;
    fromStatus?: PayoutStatus;
    toStatus: PayoutStatus;
    user: mongoose.Types.ObjectId;
    reason?: string;
    createdAt: Date;
}

const payoutAuditSchema = new Schema<IPayoutAudit>(
    {
        payout: { type: Schema.Types.ObjectId, ref: 'Payout', required: true },
        action: { type: String, required: true },
        fromStatus: { type: String, enum: Object.values(PayoutStatus) },
        toStatus: { type: String, enum: Object.values(PayoutStatus), required: true },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        reason: { type: String },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

payoutAuditSchema.index({ payout: 1 });
payoutAuditSchema.index({ user: 1 });
payoutAuditSchema.index({ createdAt: -1 });

export const PayoutAudit = mongoose.model<IPayoutAudit>('PayoutAudit', payoutAuditSchema);
