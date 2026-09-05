import { pool } from '../config/db';

export async function getUserByEmail(email: string) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1 AND is_active = true', [email]);
  return result.rows[0];
}
