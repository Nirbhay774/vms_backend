import mongoose, { Schema, Document } from 'mongoose';

export interface IAudit extends Document {
    action: string;
    resource: string;
    resourceId: string;
    user: mongoose.Types.ObjectId;
    oldState?: any;
    newState?: any;
    ipAddress?: string;
    createdAt: Date;
}

const auditSchema = new Schema<IAudit>(
    {
        action: { type: String, required: true },
        resource: { type: String, required: true },
        resourceId: { type: String, required: true },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        oldState: { type: Schema.Types.Mixed },
        newState: { type: Schema.Types.Mixed },
        ipAddress: { type: String },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

// Indexes for fast querying
auditSchema.index({ resource: 1, resourceId: 1 });
auditSchema.index({ user: 1 });
auditSchema.index({ createdAt: -1 });

export const Audit = mongoose.model<IAudit>('Audit', auditSchema);
