import { Router } from 'express';
import { PayoutController } from './payout.controller.js';
import { PayoutValidator } from './payout.validator.js';
import { authGuard } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';
import { UserRole } from '../../constants/index.js';

const router = Router();

router.use(authGuard);

router.post(
    '/draft',
    requireRole(UserRole.OPS),
    PayoutValidator.validateCreateDraft,
    PayoutController.createDraft
);

router.post(
    '/:id/submit',
    requireRole(UserRole.OPS),
    PayoutController.submitPayout
);

router.post(
    '/:id/approve',
    requireRole(UserRole.FINANCE),
    PayoutController.approvePayout
);

router.post(
    '/:id/reject',
    requireRole(UserRole.FINANCE),
    PayoutValidator.validateRejectPayout,
    PayoutController.rejectPayout
);

router.get(
    '/',
    requireRole(UserRole.FINANCE, UserRole.VENDOR, UserRole.OPS),
    PayoutController.getPayouts
);

export default router;
