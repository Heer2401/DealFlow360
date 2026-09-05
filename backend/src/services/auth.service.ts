import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { userRepository, CreateUserDTO, User, Role } from '../repositories/user.repository';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export class AuthService {
  async register(data: RegisterDTO): Promise<{ user: Omit<User, 'password_hash'>; token: string }> {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(data.password, saltRounds);

    const newUser = await userRepository.create({
      name: data.name,
      email: data.email,
      password_hash,
      role: data.role,
    });

    const token = this.generateToken(newUser);
    const safeUser = this.excludePassword(newUser);

    return { user: safeUser, token };
  }

  async login(data: LoginDTO): Promise<{ user: Omit<User, 'password_hash'>; token: string }> {
    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(data.password, user.password_hash);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user);
    const safeUser = this.excludePassword(user);

    return { user: safeUser, token };
  }

  async getUserById(id: string): Promise<Omit<User, 'password_hash'> | null> {
    const user = await userRepository.findById(id);
    if (!user) return null;
    return this.excludePassword(user);
  }

  private generateToken(user: User): string {
    const options: SignOptions = {
      expiresIn: JWT_EXPIRES_IN as any,
    };
    return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, options);
  }

  private excludePassword(user: User): Omit<User, 'password_hash'> {
    const { password_hash, ...safeUser } = user;
    return safeUser;
  }
}

export const authService = new AuthService();
