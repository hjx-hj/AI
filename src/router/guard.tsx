import { useEffect, type ReactNode } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useUserStore } from '@/store/user';
import { storage } from '@/utils/storage';
import type { UserInfo } from '@/types/auth';

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const location = useLocation();
  const { token, setUser } = useUserStore();

  useEffect(() => {
    const savedToken = storage.getToken();
    const savedUser = storage.getUser<UserInfo>();
    if (savedToken && savedUser) {
      setUser(savedUser);
    }
  }, []);

  if (!token && location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  if (token && location.pathname === '/login') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};