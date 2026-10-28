import { api } from './api';
import { END_POINT } from '@/config/apiURL';
import type { UserRole } from '@/lib/types';

export type ProfileRole = Exclude<UserRole, 'admin'>;

export interface ProfileData {
  _id: string;
  userId?: string | { firstName?: string; lastName?: string; email?: string };
  enrolledCourses?: string[];
  completedTests?: string[];
  studyStreak?: number;
  overallScore?: number;
  targetExam?: string;
  instituteName?: string;
  publisherName?: string;
  bio?: string;
  specializations?: string[];
  experience?: number;
  coursesCount?: number;
  studentsCount?: number;
  rating?: number;
  verified?: boolean;
}

const profileUrl: Record<ProfileRole, string> = END_POINT.profile;

function unwrapProfile(response: unknown): ProfileData {
  if (!response || typeof response !== 'object') {
    throw new Error('The profile response is invalid.');
  }

  const root = response as Record<string, unknown>;
  const data = root.data;
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('The profile response does not include profile data.');
  }

  return data as ProfileData;
}

export const profileApi = api.injectEndpoints({
  endpoints: (build) => ({
    getProfile: build.query<ProfileData, { role: ProfileRole; userId: string }>({
      query: ({ role, userId }) => ({
        url: profileUrl[role].replace(':id', encodeURIComponent(userId)),
        method: 'GET',
      }),
      transformResponse: unwrapProfile,
    }),
    updateEducatorProfile: build.mutation<ProfileData, {
      userId: string;
      bio: string;
      specializations: string[];
      experience: number;
    }>({
      query: (body) => ({ url: END_POINT.educator.update, method: 'PUT', body }),
      transformResponse: unwrapProfile,
    }),
  }),
});

export const { useGetProfileQuery, useUpdateEducatorProfileMutation } = profileApi;
