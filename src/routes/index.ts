import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from '../modules/auth/auth.routes.js';
import vendorRoutes from '../modules/vendor/vendor.routes.js';
import payoutRoutes from '../modules/payout/payout.routes.js';
import auditRoutes from '../modules/audit/audit.routes.js';
import dashboardRoutes from '../modules/dashboard/dashboard.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/vendors', vendorRoutes);
router.use('/payouts', payoutRoutes);
router.use('/audit', auditRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
