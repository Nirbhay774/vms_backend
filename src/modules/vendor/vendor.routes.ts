import { Router } from 'express';
import { VendorController } from './vendor.controller.js';
import { VendorValidator } from './vendor.validator.js';
import { authGuard } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';
import { UserRole } from '../../constants/index.js';

const router = Router();

// All vendor routes require authentication
router.use(authGuard);

router.post(
    '/',
    requireRole(UserRole.FINANCE, UserRole.OPS),
    VendorValidator.validateCreateVendor,
    VendorController.createVendor
);

router.get(
    '/',
    requireRole(UserRole.FINANCE, UserRole.OPS),
    VendorController.getAllVendors
);

router.get(
    '/:id',
    requireRole(UserRole.FINANCE, UserRole.OPS),
    VendorController.getVendorById
);

router.patch(
    '/:id',
    requireRole(UserRole.FINANCE, UserRole.OPS),
    VendorValidator.validateUpdateVendor,
    VendorController.updateVendor
);

router.delete(
    '/:id',
    requireRole(UserRole.FINANCE, UserRole.OPS),
    VendorController.deleteVendor
);

export default router;
