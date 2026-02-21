import { Vendor } from '../vendor/vendor.model.js';
import { Payout } from '../payout/payout.model.js';

export class DashboardService {
    static async getStats() {
        const [totalVendors, totalPayouts] = await Promise.all([
            Vendor.countDocuments(),
            Payout.countDocuments(),
        ]);

        return {
            totalVendors,
            totalPayouts,
        };
    }
}
