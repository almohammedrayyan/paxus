/** API endpoints. Configure VITE_API_BASE_URL in .env for each environment. */
export const END_POINT = {
  // A missing or empty value must not resolve `/api/...` against the Vite dev server.
  baseUrl: import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:4080",
  auth: {
    login: "/api/auth/login",
    logout: "/api/auth/logout",
    refreshToken: "/api/auth/refreshToken",
  },
  users: {
    create: "/api/users/create",
  },
  educator: {
    create: "/api/educator/create",
    update: "/api/educator/update",
  },
  student: {
    create: "/api/student/create",
  },
  institute: {
    create: "/api/institute/create",
  },
  publish: {
    create: "/api/publish/create",
  },
  profile: {
    student: "/api/student/getById/:id",
    institute: "/api/institute/getById/:id",
    educator: "/api/educator/getById/:id",
    publisher: "/api/publish/getById/:id",
  },
  course: {
    create: "/api/course/create",
    getAll: "/api/course/get-all",
    getById: "/api/course/getById/:id",
    update: "/api/course/update",
    delete: "/api/course/delete/:id",
    applyCourse: "/api/course/apply-course/:id",
  },
} as const;
