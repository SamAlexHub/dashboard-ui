
export type UserRole = 'admin' | 'superadmin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

const MOCK_USERS: User[] = [
  { id: '1', name: 'Super Admin', email: 'super@example.com', role: 'superadmin' },
  { id: '2', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
  { id: '3', name: 'Regular User', email: 'user@example.com', role: 'user' },
];

export async function login(email: string): Promise<User | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const user = MOCK_USERS.find(u => u.email === email);
  return user || null;
}

export async function getCurrentUser(): Promise<User | null> {
    // In a real app, verify token from cookie/header
    return null;
}
