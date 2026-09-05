import bcrypt from 'bcrypt';
import { getUserByEmail } from '../repositories/userRepository';
import { generateToken } from '../utils/jwt';

export async function login(email: string, passwordString: string) {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isValid = await bcrypt.compare(passwordString, user.password_hash);
  if (!isValid) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken({ id: user.id, role: user.role });
  
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role
    }
  };
}
