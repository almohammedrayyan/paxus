import { api } from "./api";
import { END_POINT } from "@/config/apiURL";
import type { UserRole } from "@/lib/types";

export interface CourseProviderScope {
  role: UserRole;
  providerType: UserRole;
  providerId: string;
}

export interface CourseRequest extends CourseProviderScope {
  _id?: string;
  title: string;
  description: string;
  category: string;
  subjects: string[];
  stage: "prelims" | "mains" | "interview" | "all";
  language: string;
  price: number;
  originalPrice?: number;
}

type CourseByIdRequest = { _id: string };
type DeleteCourseRequest = CourseProviderScope & { _id: string };

const withCourseId = (url: string, _id: string) =>
  url.replace(":id", encodeURIComponent(_id));

export const courseApi = api.injectEndpoints({
  endpoints: (build) => ({
    createCourse: build.mutation<unknown, CourseRequest>({
      query: (body) => ({ url: END_POINT.course.create, method: "POST", body }),
    }),
    getAllCourses: build.query<unknown, CourseProviderScope | void>({
      query: (params) => ({
        url: END_POINT.course.getAll,
        method: "GET",
        params: params ?? undefined,
      }),
    }),
    getCourseById: build.mutation<unknown, CourseByIdRequest>({
      query: ({ _id }) => ({
        url: withCourseId(END_POINT.course.getById, _id),
        method: "GET",
      }),
    }),
    updateCourse: build.mutation<unknown, CourseRequest>({
      query: (body) => ({ url: END_POINT.course.update, method: "PUT", body }),
    }),
    deleteCourse: build.mutation<unknown, DeleteCourseRequest>({
      query: ({ _id, ...body }) => ({
        url: withCourseId(END_POINT.course.delete, _id),
        method: "DELETE",
        body,
      }),
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useGetAllCoursesQuery,
  useLazyGetAllCoursesQuery,
  useGetCourseByIdMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = courseApi;
