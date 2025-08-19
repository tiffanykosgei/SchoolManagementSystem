import { createContext, useContext, useState, useEffect } from 'react';

// ✅ Step 1: Define default context structure
const AuthContext = createContext({
  token: null,
  role: null,
  setToken: () => {},
  setRole: () => {},
  logout: () => {},
});

// 2. Provider Component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');

    if (storedToken) setToken(storedToken);
    if (storedRole) setRole(storedRole);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, setToken, setRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 5. Custom hook for easy access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
