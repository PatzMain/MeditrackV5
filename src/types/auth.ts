export interface User {
  id: string;
  username: string;
  full_name: string;
  role: 'admin' | 'superadmin';
  department?: string;
  phone?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
}