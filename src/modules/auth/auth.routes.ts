import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { AuthValidator } from './auth.validator.js';

const router = Router();

router.post('/register', AuthValidator.validateRegister, AuthController.register);
router.post('/login', AuthValidator.validateLogin, AuthController.login);

export default router;
