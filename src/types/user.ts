export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'public';
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: 'owner' | 'editor' | 'viewer';
  created_at: string;
}

export interface AuthSession {
  user: AdminUser;
  token: string;
  expires_at: string;
}

export interface LoginInput {
  email: string;
  password?: string;
}

export interface RegisterInput {
  email: string;
  password?: string;
  full_name: string;
}
