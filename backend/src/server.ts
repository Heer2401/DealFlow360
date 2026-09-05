import { app } from './app';
import { env } from './config/env';
import { pool } from './config/db';

const PORT = env.PORT || 3000;

async function startServer() {
  try {
    // Optionally check DB connection
    // await pool.query('SELECT 1');
    // console.log('Database connected');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
