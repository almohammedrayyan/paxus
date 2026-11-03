import { useState } from "react";
import { useSnackbar } from "notistack";
import { useAppSelector } from "@/store/hooks";
import {
  useCreateCourseMutation,
  useDeleteCourseMutation,
  useGetCourseByIdMutation,
  useGetAllCoursesQuery,
  useUpdateCourseMutation,
} from "@/store/courseApi";

const subjectOptions = [
  "History",
  "Geography",
  "Polity",
  "Economy",
  "Science",
  "Environment",
  "Ethics",
  "Current Affairs",
  "CSAT",
  "Essay",
  "Art & Culture",
  "GS Paper I",
  "GS Paper II",
  "GS Paper III",
  "GS Paper IV",
];

const stageOptions = ["prelims", "mains", "interview", "all"] as const;
const categoryOptions = [
  "Foundation",
  "Subject-wise",
  "Optional",
  "Answer Writing",
  "CSAT",
  "Crash Course",
];

interface CourseFormData {
  title: string;
  description: string;
  category: string;
  subjects: string[];
  stage: "prelims" | "mains" | "interview" | "all";
  language: string;
  price: string;
  originalPrice: string;
}

interface CourseRow extends CourseFormData {
  id: string;
  studentsEnrolled: number;
  totalRevenue: number;
  rating: number;
  reviewsCount: number;
}

const emptyForm: CourseFormData = {
  title: "",
  description: "",
  category: "",
  subjects: [],
  stage: "prelims",
  language: "English",
  price: "",
  originalPrice: "",
};

function courseFormFromResponse(response: unknown): CourseFormData | null {
  if (!response || typeof response !== "object") return null;
  const record = response as Record<string, unknown>;
  const course = (
    record.data && typeof record.data === "object" ? record.data : record
  ) as Record<string, unknown>;
  if (
    typeof course.title !== "string" ||
    typeof course.description !== "string"
  )
    return null;

  return {
    title: course.title,
    description: course.description,
    category: typeof course.category === "string" ? course.category : "",
    subjects: Array.isArray(course.subjects)
      ? course.subjects.filter(
          (subject): subject is string => typeof subject === "string",
        )
      : [],
    stage:
      course.stage === "mains" ||
      course.stage === "interview" ||
      course.stage === "all"
        ? course.stage
        : "prelims",
    language: typeof course.language === "string" ? course.language : "English",
    price: String(course.price ?? ""),
    originalPrice: String(course.originalPrice ?? ""),
  };
}

function errorMessage(error: unknown) {
  if (error && typeof error === "object") {
    const data = (error as { data?: unknown }).data;
    if (
      data &&
      typeof data === "object" &&
      typeof (data as { message?: unknown }).message === "string"
    ) {
      return (data as { message: string }).message;
    }
  }
  return "Something went wrong. Please try again.";
}

function courseRowsFromResponse(response: unknown): {
  courses: CourseRow[];
  totalRevenue: number;
} {
  if (!response || typeof response !== "object") {
    return { courses: [], totalRevenue: 0 };
  }
  const root = response as Record<string, unknown>;
  const payload = root.data;
  const courses = Array.isArray(payload)
    ? payload
    : payload &&
        typeof payload === "object" &&
        Array.isArray((payload as Record<string, unknown>).courses)
      ? ((payload as Record<string, unknown>).courses as unknown[])
      : [];

  const rows: CourseRow[] = courses.flatMap((item): CourseRow[] => {
    if (!item || typeof item !== "object") return [];
    const course = item as Record<string, unknown>;
    const id =
      typeof course._id === "string"
        ? course._id
        : typeof course.id === "string"
          ? course.id
          : null;
    const formData = courseFormFromResponse(course);
    if (!id || !formData) return [];
    return [
      {
        id,
        ...formData,
        studentsEnrolled:
          Array.isArray(course.studentsEnrolled)
            ? course.studentsEnrolled.length
            : typeof course.studentsEnrolled === "number"
              ? course.studentsEnrolled
              : 0,
        totalRevenue:
          typeof course.totalRevenue === "number" ? course.totalRevenue : 0,
        rating: typeof course.rating === "number" ? course.rating : 0,
        reviewsCount:
          typeof course.reviewsCount === "number" ? course.reviewsCount : 0,
      },
    ];
  });

  const responseTotalRevenue =
    payload &&
    typeof payload === "object" &&
    typeof (payload as Record<string, unknown>).totalRevenue === "number"
      ? Number((payload as Record<string, unknown>).totalRevenue)
      : rows.reduce((sum, course) => sum + course.totalRevenue, 0);

  return { courses: rows, totalRevenue: responseTotalRevenue };
}

export default function InstituteCoursesPage() {
  const user = useAppSelector((state) => state.auth.session?.user);
  const { enqueueSnackbar } = useSnackbar();
  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();
  const [getCourseById] = useGetCourseByIdMutation();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();
  const [deleteCourse] = useDeleteCourseMutation();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CourseFormData>(emptyForm);
  const [filterStage, setFilterStage] = useState<string>("all-stages");
  const [searchQuery, setSearchQuery] = useState("");
  const providerScope = user
    ? {
        role: user.role,
        providerType: user.role,
        providerId: user.id,
      }
    : null;

  const { data: coursesResponse, refetch } = useGetAllCoursesQuery(
    providerScope!,
    { skip: !providerScope },
  );
  const { courses: instituteCourses, totalRevenue } =
    courseRowsFromResponse(coursesResponse);

  const filteredCourses = instituteCourses.filter((course) => {
    const matchesStage =
      filterStage === "all-stages" || course.stage === filterStage;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const handleOpenCreate = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowModal(true);
  };

  const handleOpenEdit = async (courseId: string) => {
    const course = instituteCourses.find((c) => c.id === courseId);
    if (course) {
      setFormData({
        title: course.title,
        description: course.description,
        category: course.category,
        subjects: course.subjects,
        stage: course.stage,
        language: course.language,
        price: course.price.toString(),
        originalPrice: course.originalPrice.toString(),
      });
      setEditingId(courseId);
      setShowModal(true);
    }

    if (!providerScope) {
      enqueueSnackbar("Your session has expired. Please sign in again.", {
        variant: "error",
      });
      return;
    }

    try {
      const response = await getCourseById({ _id: courseId }).unwrap();
      const apiFormData = courseFormFromResponse(response);
      if (apiFormData) setFormData(apiFormData);
    } catch (error) {
      enqueueSnackbar(errorMessage(error), { variant: "error" });
    }
  };

  const handleSubjectToggle = (subject: string) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!providerScope) {
      enqueueSnackbar("Your session has expired. Please sign in again.", {
        variant: "error",
      });
      return;
    }

    const body = {
      ...providerScope,
      ...(editingId ? { _id: editingId } : {}),
      ...formData,
      price: Number(formData.price),
      originalPrice: formData.originalPrice
        ? Number(formData.originalPrice)
        : undefined,
    };

    try {
      if (editingId) {
        await updateCourse(body).unwrap();
        void refetch();
        enqueueSnackbar("Course updated successfully.", { variant: "success" });
      } else {
        await createCourse(body).unwrap();
        void refetch();
        enqueueSnackbar("Course created successfully.", { variant: "success" });
      }
      setShowModal(false);
      setFormData(emptyForm);
      setEditingId(null);
    } catch (error) {
      enqueueSnackbar(errorMessage(error), { variant: "error" });
    }
  };

  const handleDelete = async (courseId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this course? This action cannot be undone.",
      )
    )
      return;
    if (!providerScope) {
      enqueueSnackbar("Your session has expired. Please sign in again.", {
        variant: "error",
      });
      return;
    }

    try {
      await deleteCourse({ _id: courseId, ...providerScope }).unwrap();
      void refetch();
      enqueueSnackbar("Course deleted successfully.", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(errorMessage(error), { variant: "error" });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="order-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-gray-900">
            Course Management
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Manage and organize your courses
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="group inline-flex h-10 items-center self-start overflow-hidden rounded-lg bg-indigo-600 text-sm font-medium text-white shadow-sm transition-[width,background-color] duration-200 hover:w-36 hover:bg-indigo-700 sm:self-auto"
          title="Create course"
        >
          <svg
            className="mx-2.5 h-5 w-5 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-200 group-hover:max-w-28 group-hover:opacity-100">Create course</span>
        </button>
      </div>

      {/* Filters */}
      <div className="order-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <div className="relative">
              <svg
                className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-11 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:w-52"
          >
            <option value="all-stages">All Stages</option>
            <option value="prelims">Prelims</option>
            <option value="mains">Mains</option>
            <option value="interview">Interview</option>
            <option value="all">All Stages Course</option>
          </select>
        </div>
      </div>

      {/* Course Summary */}
      <div className="order-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4 shadow-sm"><span className="mb-2 grid h-7 w-7 place-items-center rounded-lg bg-emerald-100 text-sm font-bold text-emerald-700">₹</span>
          <div className="text-lg font-semibold text-emerald-600">
            ₹
            {totalRevenue.toLocaleString("en-IN", {
              maximumFractionDigits: 0,
            })}
          </div>
          <div className="mt-0.5 text-xs text-gray-500">Total Revenue</div>
        </div>
        <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-4 shadow-sm"><span className="mb-2 grid h-7 w-7 place-items-center rounded-lg bg-indigo-100 text-sm font-bold text-indigo-700">▤</span>
          <div className="text-lg font-semibold text-gray-900">
            {instituteCourses.length}
          </div>
          <div className="mt-0.5 text-xs text-gray-500">Total Courses</div>
        </div>
        <div className="rounded-xl border border-teal-100 bg-gradient-to-br from-teal-50 to-white p-4 shadow-sm"><span className="mb-2 grid h-7 w-7 place-items-center rounded-lg bg-teal-100 text-sm font-bold text-teal-700">✓</span>
          <div className="text-lg font-semibold text-green-600">
            {instituteCourses.length}
          </div>
          <div className="mt-0.5 text-xs text-gray-500">Active</div>
        </div>
        <div className="rounded-xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white p-4 shadow-sm"><span className="mb-2 grid h-7 w-7 place-items-center rounded-lg bg-sky-100 text-sm font-bold text-sky-700">◉</span>
          <div className="text-lg font-semibold text-gray-900">
            {instituteCourses
              .reduce((sum, c) => sum + c.studentsEnrolled, 0)
              .toLocaleString()}
          </div>
          <div className="mt-0.5 text-xs text-gray-500">Total Enrolled</div>
        </div>
        <div className="rounded-xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-4 shadow-sm"><span className="mb-2 grid h-7 w-7 place-items-center rounded-lg bg-amber-100 text-sm font-bold text-amber-700">★</span>
          <div className="text-lg font-semibold text-amber-600">
            {instituteCourses.length
              ? (
                  instituteCourses.reduce((sum, c) => sum + c.rating, 0) /
                  instituteCourses.length
                ).toFixed(1)
              : "0.0"}
          </div>
          <div className="mt-0.5 text-xs text-gray-500">Avg. Rating</div>
        </div>
      </div>

      {/* Courses Table */}
      <div className="order-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  Course
                </th>
                <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  Stage
                </th>
                <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  Students
                </th>
                <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  Revenue
                </th>
                <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  Rating
                </th>
                <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCourses.map((course) => (
                <tr
                  key={course.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-indigo-400 to-purple-500">
                        <svg
                          className="h-4 w-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 max-w-xs truncate">
                          {course.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {course.category} &middot; {course.language}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                        course.stage === "prelims"
                          ? "bg-blue-100 text-blue-700"
                          : course.stage === "mains"
                            ? "bg-green-100 text-green-700"
                            : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {course.stage.charAt(0).toUpperCase() +
                        course.stage.slice(1)}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-sm font-medium text-gray-900">
                      {course.studentsEnrolled.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-sm font-medium text-gray-900">
                      ₹
                      {course.totalRevenue.toLocaleString("en-IN", {
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500 text-sm">★</span>
                      <span className="text-sm font-medium text-gray-900">
                        {course.rating}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({course.reviewsCount})
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full font-medium bg-green-100 text-green-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      Active
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => void handleOpenEdit(course.id)}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit course"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => void handleDelete(course.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete course"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="w-12 h-12 text-gray-300 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="mt-3 text-sm text-gray-500">No courses found.</p>
          </div>
        )}
      </div>
      {/* Create/Edit Course Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingId ? "Edit Course" : "Create New Course"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g., Complete UPSC Prelims 2026 - GS Foundation"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe your course content, what students will learn..."
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    required
                  />
                </div>

                {/* Category & Stage */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-700"
                      required
                    >
                      <option value="">Select Category</option>
                      {categoryOptions.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stage
                    </label>
                    <select
                      value={formData.stage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          stage: e.target.value as CourseFormData["stage"],
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-700"
                      required
                    >
                      {stageOptions.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Subjects Multi-select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subjects{" "}
                    <span className="text-gray-400 font-normal">
                      ({formData.subjects.length} selected)
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                    {subjectOptions.map((subject) => (
                      <button
                        key={subject}
                        type="button"
                        onClick={() => handleSubjectToggle(subject)}
                        className={`px-3 py-1.5 text-xs rounded-full font-medium transition-colors ${
                          formData.subjects.includes(subject)
                            ? "bg-indigo-600 text-white"
                            : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
                        }`}
                      >
                        {subject}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language & Price */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select
                      value={formData.language}
                      onChange={(e) =>
                        setFormData({ ...formData, language: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-700"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Bilingual">Bilingual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      placeholder="e.g., 24999"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Original Price (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          originalPrice: e.target.value,
                        })
                      }
                      placeholder="e.g., 39999"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Upload Sections */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Content
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-indigo-300 transition-colors cursor-pointer">
                      <svg
                        className="w-8 h-8 text-gray-400 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-sm text-gray-500 font-medium">
                        Upload Videos
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        MP4, WebM up to 2GB
                      </p>
                    </div>
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-indigo-300 transition-colors cursor-pointer">
                      <svg
                        className="w-8 h-8 text-gray-400 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-sm text-gray-500 font-medium">
                        Upload PDFs / Notes
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PDF, DOC up to 50MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating || isUpdating}
                    className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isCreating || isUpdating
                      ? "Saving..."
                      : editingId
                        ? "Update Course"
                        : "Create Course"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
