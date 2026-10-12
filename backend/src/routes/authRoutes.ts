import { Router } from 'express';
import { authController } from '../controllers/authController.js';

export const authRouter = Router();

authRouter.get('/github', authController.getLoginUrl);
authRouter.get('/github/callback', authController.handleCallback);
authRouter.get('/me', authController.getMe);
authRouter.post('/logout', authController.logout);
