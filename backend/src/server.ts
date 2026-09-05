import { app } from './app';
import dotenv from 'dotenv';
import { pool } from './config/db';

dotenv.config();

const PORT = process.env.PORT || 5000;

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
