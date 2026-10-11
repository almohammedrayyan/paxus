import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/authSlice';

function getExpiry(token: string): number | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/'))) as { exp?: number };
    return decoded.exp ? decoded.exp * 1000 : null;
  } catch {
    return null;
  }
}

/** Ends the in-browser session as soon as a JWT access token reaches its expiry. */
export default function AuthSessionGuard() {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.session?.accessToken);

  useEffect(() => {
    if (!accessToken) return;
    const expiry = getExpiry(accessToken);
    if (!expiry) return;
    const delay = expiry - Date.now();
    if (delay <= 0) {
      dispatch(logout());
      return;
    }
    const timeout = window.setTimeout(() => dispatch(logout()), delay);
    return () => window.clearTimeout(timeout);
  }, [accessToken, dispatch]);

  return null;
}
