import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { router } from './routes';

export const app = express();

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Main router
app.use('/api', router);

// Basic 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: 'Not Found' });
});

// Basic error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack || err);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;
