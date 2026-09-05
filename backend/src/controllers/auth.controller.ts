import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import { ZodError } from 'zod';

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const data = registerSchema.parse(req.body);
      const result = await authService.register(data);
      res.status(201).json(result);
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: (error as any).errors });
        return;
      }
      if (error.message === 'Email already exists') {
        res.status(409).json({ error: error.message });
        return;
      }
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const data = loginSchema.parse(req.body);
      const result = await authService.login(data);
      res.json(result);
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: (error as any).errors });
        return;
      }
      if (error.message === 'Invalid credentials') {
        res.status(401).json({ error: error.message });
        return;
      }
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async me(req: Request, res: Response): Promise<void> {
    try {
      // req.user should be populated by authMiddleware
      const userId = (req as any).user.id;
      const user = await authService.getUserById(userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json({ user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async test(req: Request, res: Response): Promise<void> {
    res.json({ message: 'You have accessed a protected route.', user: (req as any).user });
  }
}

export const authController = new AuthController();
