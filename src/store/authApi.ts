import { api } from './api';
import { END_POINT } from '@/config/apiURL';
import type { AuthSession, AuthUser } from './authSlice';

interface LoginRequest {
  email: string;
  password: string;
}

type Token = { token?: string };

type LoginResponse = {
  accessToken?: string;
  refreshToken?: string;
  user?: Partial<AuthUser>;
  data?: LoginResponse;
  tokenData?: {
    access?: Token;
    refresh?: Token;
  };
  _id?: string;
  id?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
  role?: AuthUser['role'];
};

function toSession(response: LoginResponse): AuthSession {
  // The API returns { data: { data: user, tokenData: { access, refresh } } }.
  // Keep support for the previous flat response while normalizing both formats.
  const payload = response.data ?? response;
  const user: LoginResponse = payload.data ?? payload.user ?? {};
  const accessToken = payload.accessToken ?? payload.tokenData?.access?.token;
  const refreshToken = payload.refreshToken ?? payload.tokenData?.refresh?.token;
  const id = user?.id ?? user?._id;
  const role = user?.role;

  if (!accessToken || !refreshToken || !id || !role) {
    throw new Error('The login response is missing tokens or user details.');
  }

  const name = user?.name
    ?? [user?.firstName, user?.lastName].filter(Boolean).join(' ')
    ?? user?.email
    ?? 'User';

  return {
    accessToken,
    refreshToken,
    user: {
      id,
      name,
      email: user.email ?? '',
      role,
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
