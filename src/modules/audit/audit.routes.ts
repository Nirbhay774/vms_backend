import { Router } from 'express';
import { AuditController } from './audit.controller.js';
import { authGuard } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';
import { UserRole } from '../../constants/index.js';

const router = Router();

router.use(authGuard);
router.use(requireRole(UserRole.FINANCE));

router.get('/', AuditController.getLogs);

export default router;
