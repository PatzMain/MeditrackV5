export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'doctor' | 'nurse' | 'technician';
  department?: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface AuthRequest extends Request {
  user?: User;
}