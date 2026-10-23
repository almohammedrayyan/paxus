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

function courseRowsFromResponse(response: unknown): CourseRow[] {
  if (!response || typeof response !== "object") return [];
  const root = response as Record<string, unknown>;
  const payload = root.data;
  const courses = Array.isArray(payload)
    ? payload
    : payload &&
        typeof payload === "object" &&
        Array.isArray((payload as Record<string, unknown>).data)
      ? ((payload as Record<string, unknown>).data as unknown[])
      : [];

  return courses.flatMap((item) => {
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
  const instituteCourses = courseRowsFromResponse(coursesResponse);

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Course Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and organize your courses
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create New Course
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <svg
                className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
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
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 bg-white"
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-emerald-600">
            ₹
            {instituteCourses
              .reduce((sum, c) => sum + c.totalRevenue, 0)
              .toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </div>
          <div className="text-sm text-gray-500">Total Revenue</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {instituteCourses.length}
          </div>
          <div className="text-sm text-gray-500">Total Courses</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {instituteCourses.length}
          </div>
          <div className="text-sm text-gray-500">Active</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {instituteCourses
              .reduce((sum, c) => sum + c.studentsEnrolled, 0)
              .toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Total Enrolled</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {instituteCourses.length
              ? (
                  instituteCourses.reduce((sum, c) => sum + c.rating, 0) /
                  instituteCourses.length
                ).toFixed(1)
              : "0.0"}
          </div>
          <div className="text-sm text-gray-500">Avg. Rating</div>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-6">
                  Course
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                  Stage
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                  Students
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                  Revenue
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                  Rating
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                  Status
                </th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-6">
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
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-5 h-5 text-white"
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
                  <td className="py-4 px-4">
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
                  <td className="py-4 px-4">
                    <span className="text-sm font-medium text-gray-900">
                      {course.studentsEnrolled.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-medium text-gray-900">
                      ₹
                      {course.totalRevenue.toLocaleString("en-IN", {
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </td>
                  <td className="py-4 px-4">
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
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full font-medium bg-green-100 text-green-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      Active
                    </span>
                  </td>
                  <td className="py-4 px-6">
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
