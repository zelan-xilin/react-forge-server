import { Router } from 'express';
import { authController } from './auth.controller';

export const authRoutes = Router();

/** 用户登录 */
authRoutes.post('/login', authController.login);
