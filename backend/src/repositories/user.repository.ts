import { pool } from '../config/db';

export type Role = 'ADMIN' | 'SALES_REP' | 'SALES_MANAGER' | 'FINANCE_OPERATIONS' | 'CUSTOMER';

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: Role;
  created_at: Date;
  updated_at: Date;
}

export type CreateUserDTO = Omit<User, 'id' | 'created_at' | 'updated_at'>;

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  }

  async findById(id: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async create(user: CreateUserDTO): Promise<User> {
    const { name, email, password_hash, role } = user;
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, password_hash, role]
    );
    return result.rows[0];
  }
}

export const userRepository = new UserRepository();
