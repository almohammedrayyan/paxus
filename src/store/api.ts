import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { END_POINT } from '@/config/apiURL';
import { logout } from './authSlice';
import type { RootState } from './store';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: END_POINT.baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.session?.accessToken;
    if (token) headers.set('authorization', `Bearer ${token}`);
    return headers;
  },
});

export const baseQueryWithLogout: typeof rawBaseQuery = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status === 401) api.dispatch(logout());
  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithLogout,
  endpoints: () => ({}),
});
