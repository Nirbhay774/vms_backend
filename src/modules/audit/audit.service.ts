import { Audit, IAudit } from './audit.model.js';

export class AuditService {
    /**
     * Log an action to the audit trail
     */
    static async logAction(data: {
        action: string;
        resource: string;
        resourceId: string;
        user: string;
        oldState?: any;
        newState?: any;
        ipAddress?: string;
    }): Promise<IAudit> {
        const audit = new Audit(data);
        return await audit.save();
    }

    /**
     * Get audit logs with filters
     */
    static async getLogs(filter: any = {}, page = 1, limit = 20): Promise<{ logs: IAudit[]; total: number }> {
        const skip = (page - 1) * limit;
        const [logs, total] = await Promise.all([
            Audit.find(filter)
                .populate('user', 'name email role')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Audit.countDocuments(filter),
        ]);
        return { logs, total };
    }
}
