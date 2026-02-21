import { Router } from 'express';
import { DashboardController } from './dashboard.controller.js';
import { authGuard } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';
import { UserRole } from '../../constants/index.js';

const router = Router();

router.use(authGuard);

// Both Finance and Ops should be able to see dashboard stats
router.get(
    '/stats',
    requireRole(UserRole.FINANCE, UserRole.OPS),
    DashboardController.getStats
);

export default router;
