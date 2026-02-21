import { Payout, IPayout } from './payout.model.js';
import { PayoutAudit } from './payout-audit.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { StatusCodes, PayoutStatus, UserRole } from '../../constants/index.js';

export class PayoutService {
    /**
     * Helper to log payout status transitions
     */
    private static async logAudit(payoutId: string, action: string, fromStatus: PayoutStatus | undefined, toStatus: PayoutStatus, userId: string, reason?: string) {
        await PayoutAudit.create({
            payout: payoutId,
            action,
            fromStatus,
            toStatus,
            user: userId,
            reason
        });
    }

    /**
     * Create a new Payout in DRAFT status.
     * Only OPS can create DRAFT.
     */
    static async createDraft(payoutData: Partial<IPayout>, userId: string, userRole: UserRole): Promise<IPayout> {
        if (userRole !== UserRole.OPS) {
            throw new ApiError(StatusCodes.FORBIDDEN, 'Only OPS role can create payout drafts');
        }

        const payout = new Payout({
            ...payoutData,
            status: PayoutStatus.DRAFT,
            createdBy: userId
        });

        await payout.save();
        await this.logAudit(payout._id.toString(), 'CREATED', undefined, PayoutStatus.DRAFT, userId);

        return payout;
    }

    /**
     * Submit a DRAFT payout to SUBMITTED status.
     * Only OPS can submit DRAFT -> SUBMITTED.
     */
    static async submitPayout(id: string, userId: string, userRole: UserRole): Promise<IPayout> {
        const payout = await Payout.findById(id);
        if (!payout) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Payout not found');
        }

        if (userRole !== UserRole.OPS) {
            throw new ApiError(StatusCodes.FORBIDDEN, 'Only OPS role can submit payout drafts');
        }

        if (payout.status !== PayoutStatus.DRAFT) {
            throw new ApiError(StatusCodes.BAD_REQUEST, `Cannot submit a payout that is in ${payout.status} status`);
        }

        const oldStatus = payout.status;
        payout.status = PayoutStatus.SUBMITTED;
        await payout.save();

        await this.logAudit(id, 'SUBMITTED', oldStatus, PayoutStatus.SUBMITTED, userId);

        return payout;
    }

    /**
     * Approve a SUBMITTED payout.
     * Only FINANCE can approve SUBMITTED -> APPROVED.
     */
    static async approvePayout(id: string, userId: string, userRole: UserRole): Promise<IPayout> {
        const payout = await Payout.findById(id);
        if (!payout) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Payout not found');
        }

        if (userRole !== UserRole.FINANCE) {
            throw new ApiError(StatusCodes.FORBIDDEN, 'Only FINANCE role can approve payouts');
        }

        if (payout.status !== PayoutStatus.SUBMITTED) {
            throw new ApiError(StatusCodes.BAD_REQUEST, `Only submitted payouts can be approved (current status: ${payout.status})`);
        }

        const oldStatus = payout.status;
        payout.status = PayoutStatus.APPROVED;
        payout.approvedBy = userId as any;
        await payout.save();

        await this.logAudit(id, 'APPROVED', oldStatus, PayoutStatus.APPROVED, userId);

        return payout;
    }

    /**
     * Reject a SUBMITTED payout.
     * Only FINANCE can reject SUBMITTED -> REJECTED.
     * Reason is mandatory.
     */
    static async rejectPayout(id: string, reason: string, userId: string, userRole: UserRole): Promise<IPayout> {
        if (!reason) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'A reason is mandatory for rejection');
        }

        const payout = await Payout.findById(id);
        if (!payout) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Payout not found');
        }

        if (userRole !== UserRole.FINANCE) {
            throw new ApiError(StatusCodes.FORBIDDEN, 'Only FINANCE role can reject payouts');
        }

        if (payout.status !== PayoutStatus.SUBMITTED) {
            throw new ApiError(StatusCodes.BAD_REQUEST, `Only submitted payouts can be rejected (current status: ${payout.status})`);
        }

        const oldStatus = payout.status;
        payout.status = PayoutStatus.REJECTED;
        payout.rejectionReason = reason;
        await payout.save();

        await this.logAudit(id, 'REJECTED', oldStatus, PayoutStatus.REJECTED, userId, reason);

        return payout;
    }

    static async getPayouts(filter: any, page = 1, limit = 10): Promise<{ payouts: IPayout[]; total: number }> {
        const skip = (page - 1) * limit;
        const [payouts, total] = await Promise.all([
            Payout.find(filter).populate('vendor', 'name email').populate('createdBy', 'name').skip(skip).limit(limit).sort({ createdAt: -1 }),
            Payout.countDocuments(filter),
        ]);
        return { payouts, total };
    }
}
