import { api } from './api';
import { END_POINT } from '@/config/apiURL';
import type { AuthSession, AuthUser } from './authSlice';
import type { UserRole } from '@/lib/types';

interface LoginRequest {
  email: string;
  password: string;
}

type Token = { token?: string };

interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  city: string;
  role: UserRole;
  targetExam?: string;
  stage?: string;
  optionalSubject?: string;
  language?: string;
  instituteName?: string;
  instituteDescription?: string;
  instituteAddress?: string;
  bio?: string;
  specializations?: string;
  experience?: number;
  publisherName?: string;
  publisherDescription?: string;
}

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

function getCreatedUserId(response: unknown): string | undefined {
  if (!response || typeof response !== 'object') return undefined;

  const payload = response as { _id?: unknown; id?: unknown; data?: unknown };
  if (typeof payload._id === 'string') return payload._id;
  if (typeof payload.id === 'string') return payload.id;
  return getCreatedUserId(payload.data);
}

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<AuthSession, LoginRequest>({
      query: (body) => ({ url: END_POINT.auth.login, method: 'POST', body }),
      transformResponse: (response: LoginResponse) => toSession(response),
    }),
    logout: build.mutation<void, { _id: string }>({
      query: (body) => ({ url: END_POINT.auth.logout, method: 'POST', body }),
    }),
    signup: build.mutation<void, SignupRequest>({
      queryFn: async (signup, _api, _extraOptions, baseQuery) => {
        const userResult = await baseQuery({
          url: END_POINT.users.create,
          method: 'POST',
          body: {
            firstName: signup.firstName,
            lastName: signup.lastName,
            email: signup.email,
            phone: signup.phone,
            password: signup.password,
            city: signup.city,
            role: signup.role,
          },
        });

        if ('error' in userResult) return { error: userResult.error };

        const userId = getCreatedUserId(userResult.data);
        if (!userId) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: 'The user creation response did not include an _id.',
            },
          };
        }

        let profileRequest: { url: string; body: Record<string, unknown> } | undefined;
        switch (signup.role) {
          case 'student':
            profileRequest = {
              url: END_POINT.student.create,
              body: { userId, role: signup.role, targetExam: signup.targetExam, stage: signup.stage, optionalSubject: signup.optionalSubject, language: signup.language },
            };
            break;
          case 'educator':
            profileRequest = {
              url: END_POINT.educator.create,
              body: {
                userId,
                role: signup.role,
                bio: signup.bio,
                specializations: signup.specializations?.split(',').map((item) => item.trim()).filter(Boolean),
                experience: signup.experience,
              },
            };
            break;
          case 'institute':
            profileRequest = {
              url: END_POINT.institute.create,
              body: { userId, role: signup.role, instituteName: signup.instituteName, description: signup.instituteDescription, address: signup.instituteAddress },
            };
            break;
          case 'publisher':
            profileRequest = {
              url: END_POINT.publish.create,
              body: { userId, role: signup.role, publisherName: signup.publisherName, description: signup.publisherDescription },
            };
            break;
          case 'admin':
            break;
        }

        if (!profileRequest) return { data: undefined };

        const profileResult = await baseQuery({
          url: profileRequest.url,
          method: 'POST',
          body: profileRequest.body,
        });

        if ('error' in profileResult) return { error: profileResult.error };
        return { data: undefined };
      },
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useSignupMutation } = authApi;
