import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// ─── Mock credentials ───────────────────────────────────────────────────────
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'admin@eullafied.com': {
    password: 'Admin@123',
    user: { id: '1', email: 'admin@eullafied.com', firstName: 'Admin', lastName: 'User', role: 'ADMIN' },
  },
  'john.doe@eullafied.com': {
    password: 'Staff@123',
    user: { id: '2', email: 'john.doe@eullafied.com', firstName: 'John', lastName: 'Doe', role: 'STAFF' },
  },
  'jane.smith@eullafied.com': {
    password: 'Manager@123',
    user: { id: '3', email: 'jane.smith@eullafied.com', firstName: 'Jane', lastName: 'Smith', role: 'MANAGER' },
  },
};
// ────────────────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Restore session from localStorage on page refresh
  useEffect(() => {
    const stored = localStorage.getItem('mock_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('mock_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 600));

    const match = MOCK_USERS[email.toLowerCase()];
    if (!match || match.password !== password) {
      throw { response: { data: { message: 'Invalid email or password' } } };
    }

    localStorage.setItem('mock_user', JSON.stringify(match.user));
    setUser(match.user);
    navigate('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('mock_user');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
