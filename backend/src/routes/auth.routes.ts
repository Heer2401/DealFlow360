import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authMiddleware, requireRole } from '../middleware/auth.middleware';

export const authRouter = Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);

// Protected routes
authRouter.use(authMiddleware);

authRouter.get('/me', authController.me);
authRouter.get('/test', authController.test);

// Example role-protected route (just to verify requireRole)
authRouter.get('/admin-only', requireRole(['ADMIN']), (req, res) => {
  res.json({ message: 'Admin access granted' });
});
