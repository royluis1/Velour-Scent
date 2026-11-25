import { createContext, useContext, useMemo, useState } from 'react';
import { loginAdmin } from '../utils/api';

const AuthContext = createContext(null);
const KEY = 'vs_admin';

// La contraseña se valida en el backend; el navegador solo conserva un token temporal de sesión.
export function AuthProvider({ children }) {
  const [logged, setLogged] = useState(() => Boolean(sessionStorage.getItem(KEY)));

  const value = useMemo(() => ({
    logged,
    login: async (password) => {
      try {
        const { token } = await loginAdmin(password);
        sessionStorage.setItem(KEY, token);
        setLogged(true);
        return true;
      } catch (error) {
        if (error.status === 401) return false;
        throw error;
      }
    },
    logout: () => {
      sessionStorage.removeItem(KEY);
      setLogged(false);
    },
  }), [logged]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}
