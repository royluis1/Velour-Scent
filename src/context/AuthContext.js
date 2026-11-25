import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);
const KEY = 'vs_admin';

// Barrera de demo: REACT_APP_* queda visible en el navegador; en producción validar en un backend.
export function AuthProvider({ children }) {
  const [logged, setLogged] = useState(() => sessionStorage.getItem(KEY) === 'true');

  const value = useMemo(() => ({
    logged,
    login: (password) => {
      const expectedPassword = process.env.REACT_APP_ADMIN_PASSWORD;
      if (!expectedPassword || password !== expectedPassword) return false;
      sessionStorage.setItem(KEY, 'true');
      setLogged(true);
      return true;
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
