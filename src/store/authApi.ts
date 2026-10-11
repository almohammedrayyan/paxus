import { api } from './api';
import { END_POINT } from '@/config/apiURL';
import type { AuthSession, AuthUser } from './authSlice';

interface LoginRequest {
  email: string;
  password: string;
}

type LoginResponse = {
  accessToken?: string;
  refreshToken?: string;
  user?: Partial<AuthUser>;
  data?: LoginResponse;
};

function toSession(response: LoginResponse): AuthSession {
  const payload = response.data ?? response;
  const user = payload.user;
  if (!payload.accessToken || !payload.refreshToken || !user?.id || !user.role) {
    throw new Error('The login response is missing tokens or user details.');
  }
  return {
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken,
    user: {
      id: user.id,
      name: user.name ?? user.email ?? 'User',
      email: user.email ?? '',
      role: user.role,
      avatar: user.avatar,
    },
  };
}

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<AuthSession, LoginRequest>({
      query: (body) => ({ url: END_POINT.auth.login, method: 'POST', body }),
      transformResponse: (response: LoginResponse) => toSession(response),
    }),
    logout: build.mutation<void, { refreshToken: string }>({
      query: (body) => ({ url: END_POINT.auth.logout, method: 'POST', body }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = authApi;
