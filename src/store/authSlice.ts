import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserRole } from '@/lib/types';

const SESSION_KEY = 'paxus_auth_session';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

interface AuthState {
  session: AuthSession | null;
}

function readSession(): AuthSession | null {
  try {
    const saved = sessionStorage.getItem(SESSION_KEY);
    return saved ? JSON.parse(saved) as AuthSession : null;
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}

function persistSession(session: AuthSession | null) {
  if (session) sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else sessionStorage.removeItem(SESSION_KEY);
}

const authSlice = createSlice({
  name: 'auth',
  initialState: { session: readSession() } as AuthState,
  reducers: {
    sessionReceived: (state, action: PayloadAction<AuthSession>) => {
      state.session = action.payload;
      persistSession(action.payload);
    },
    logout: (state) => {
      state.session = null;
      persistSession(null);
    },
  },
});

export const { sessionReceived, logout } = authSlice.actions;
export default authSlice.reducer;
