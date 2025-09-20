import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface User {
  id: string;
  username: string;
  password: string;
  full_name: string;
  role: 'admin' | 'superadmin';
  department?: string;
  phone?: string;
  created_at: string;
}

// Simple in-memory user storage (in production, this would be a database)
const users: User[] = [
  {
    id: 'admin-001',
    username: 'admin',
    password: bcrypt.hashSync('admin123', 10),
    full_name: 'System Administrator',
    role: 'admin',
    department: 'Administration',
    phone: '+1-555-0101',
    created_at: new Date().toISOString()
  },
  {
    id: 'superadmin-001',
    username: 'superadmin',
    password: bcrypt.hashSync('superadmin123', 10),
    full_name: 'Super Administrator',
    role: 'superadmin',
    department: 'System Management',
    phone: '+1-555-0001',
    created_at: new Date().toISOString()
  }
];

export const findUserByUsername = (username: string): User | undefined => {
  return users.find(user => user.username === username);
};

export const createUser = (userData: Omit<User, 'id' | 'created_at' | 'password'> & { password: string }): User => {
  const hashedPassword = bcrypt.hashSync(userData.password, 10);
  const newUser: User = {
    ...userData,
    id: `user-${Date.now()}`,
    password: hashedPassword,
    created_at: new Date().toISOString()
  };
  users.push(newUser);
  return newUser;
};

export const validatePassword = (plainPassword: string, hashedPassword: string): boolean => {
  return bcrypt.compareSync(plainPassword, hashedPassword);
};

export const generateToken = (user: Omit<User, 'password'>): string => {
  const payload = {
    id: user.id,
    username: user.username,
    full_name: user.full_name,
    role: user.role,
    department: user.department
  };

  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || '3600'
  });
};

export const verifyToken = (token: string): Omit<User, 'password'> | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    return decoded;
  } catch (error) {
    return null;
  }
};