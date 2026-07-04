import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { UserRole } from './types';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string, role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const demoUsers: Record<UserRole, AuthUser> = {
  student: { id: 'stu-1', name: 'Priya Sharma', email: 'priya@email.com', role: 'student' },
  institute: { id: 'inst-1', name: 'Vision IAS', email: 'admin@visionias.in', role: 'institute' },
  educator: { id: 'edu-1', name: 'Dr. Sidharth Arora', email: 'sidharth@email.com', role: 'educator' },
  publisher: { id: 'pub-1', name: 'Tata McGraw Hill', email: 'admin@tmh.com', role: 'publisher' },
  admin: { id: 'admin-1', name: 'Platform Admin', email: 'admin@examprep.com', role: 'admin' },
};

const AUTH_STORAGE_KEY = 'auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  // Restore auth state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  const login = (_email: string, _password: string, role: UserRole) => {
    const authUser = demoUsers[role];
    setUser(authUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

