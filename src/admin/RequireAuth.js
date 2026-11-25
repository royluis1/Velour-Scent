import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from './Login';

export default function RequireAuth() {
  const { logged } = useAuth();
  return logged ? <Outlet /> : <Login />;
}
