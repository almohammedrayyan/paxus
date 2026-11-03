import { useState, useMemo } from 'react';
import type { Course } from '@/lib/types';
import { useApplyCourseMutation, useGetAllCoursesQuery } from '@/store/courseApi';
import { useAppSelector } from '@/store/hooks';
import { useNavigate } from 'react-router-dom';

type SortOption = 'popularity' | 'rating' | 'price-low' | 'price-high' | 'newest';

function coursesFromResponse(response: unknown): Course[] {
  if (!response || typeof response !== 'object') return [];
  const root = response as Record<string, unknown>;
  const payload = root.data;
  // The course service responds with { data: { courses, totalRevenue } }.
  // Also support array responses and the earlier nested `data` shape.
  const records = Array.isArray(root)
    ? root
    : Array.isArray(payload)
      ? payload
      : payload && typeof payload === 'object'
        ? Array.isArray((payload as Record<string, unknown>).courses)
          ? (payload as Record<string, unknown>).courses as unknown[]
          : Array.isArray((payload as Record<string, unknown>).data)
            ? (payload as Record<string, unknown>).data as unknown[]
            : []
        : [];

  return records.flatMap((item) => {
    if (!item || typeof item !== 'object') return [];
    const course = item as Record<string, unknown>;
    const id = typeof course._id === 'string' ? course._id : typeof course.id === 'string' ? course.id : null;
    const title = typeof course.title === 'string' ? course.title : null;
    if (!id || !title) return [];
    const price = typeof course.price === 'number' ? course.price : Number(course.price) || 0;
    const originalPrice = typeof course.originalPrice === 'number' ? course.originalPrice : Number(course.originalPrice) || price;
    const providerType = course.providerType === 'educator' ? 'educator' : 'institute';

    return [{
      id,
      title,
      description: typeof course.description === 'string' ? course.description : '',
      provider: typeof course.provider === 'string' ? course.provider : typeof course.providerName === 'string' ? course.providerName : 'Paxus Provider',
      providerType,
      providerId: typeof course.providerId === 'string' ? course.providerId : '',
      category: typeof course.category === 'string' ? course.category : '',
      subjects: Array.isArray(course.subjects) ? course.subjects.filter((subject): subject is string => typeof subject === 'string') : [],
      stage: course.stage === 'mains' || course.stage === 'interview' || course.stage === 'all' ? course.stage : 'prelims',
      language: typeof course.language === 'string' ? course.language : 'English',
      price,
      originalPrice,
      rating: typeof course.rating === 'number' ? course.rating : 0,
      reviewsCount: typeof course.reviewsCount === 'number' ? course.reviewsCount : 0,
      studentsEnrolled: Array.isArray(course.studentsEnrolled)
        ? course.studentsEnrolled.length
        : typeof course.studentsEnrolled === 'number' ? course.studentsEnrolled : 0,
      duration: typeof course.duration === 'string' ? course.duration : '—',
      lessons: typeof course.lessons === 'number' ? course.lessons : 0,
      thumbnail: typeof course.thumbnail === 'string' ? course.thumbnail : '',
      featured: Boolean(course.featured),
      tags: Array.isArray(course.tags) ? course.tags.filter((tag): tag is string => typeof tag === 'string') : [],
      createdAt: typeof course.createdAt === 'string' ? course.createdAt : '',
    }];
  });
}

export default function CoursesPage() {
  const navigate = useNavigate();
  const { data: coursesResponse, isLoading, refetch } = useGetAllCoursesQuery();
  const userId = useAppSelector((state) => state.auth.session?.user.id);
  const [applyCourse, { isLoading: isEnrolling }] = useApplyCourseMutation();
  const apiCourses = useMemo(() => coursesFromResponse(coursesResponse), [coursesResponse]);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enrollError, setEnrollError] = useState<string | null>(null);

  const confirmEnrollment = async () => {
    if (!selectedCourse) return;
    if (!userId) {
      navigate('/login');
      return;
    }

    setEnrollError(null);
    try {
      await applyCourse({ _id: selectedCourse.id, userId }).unwrap();
      setSelectedCourse(null);
      await refetch();
    } catch {
      setEnrollError('Unable to enroll in this course. Please try again.');
    }
  };

  const allSubjects = useMemo(() => {
    const subjects = new Set<string>();
    apiCourses.forEach((c) => c.subjects.forEach((s) => subjects.add(s)));
    return Array.from(subjects).sort();
  }, [apiCourses]);

  const filteredCourses = useMemo(() => {
    let courses = [...apiCourses];

    // Search
    if (search) {
      const q = search.toLowerCase();
      courses = courses.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.provider.toLowerCase().includes(q) ||
          c.subjects.some((s) => s.toLowerCase().includes(q)) ||
          c.category.toLowerCase().includes(q)
      );
    }

    // Stage filter
    if (stageFilter !== 'all') {
      courses = courses.filter((c) => c.stage === stageFilter);
    }

    // Language filter
    if (languageFilter !== 'all') {
      courses = courses.filter((c) => c.language === languageFilter);
    }

    // Price range filter
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      courses = courses.filter((c) => c.price >= min && (max ? c.price <= max : true));
    }

    // Subject filter
    if (subjectFilter !== 'all') {
      courses = courses.filter((c) => c.subjects.includes(subjectFilter));
    }

    // Sort
    switch (sortBy) {
      case 'popularity':
        courses.sort((a, b) => b.studentsEnrolled - a.studentsEnrolled);
        break;
      case 'rating':
        courses.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        courses.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        courses.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        courses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return courses;
  }, [apiCourses, search, stageFilter, languageFilter, priceRange, subjectFilter, sortBy]);

  const stageOptions = [
    { value: 'all', label: 'All Stages' },
    { value: 'prelims', label: 'Prelims' },
    { value: 'mains', label: 'Mains' },
    { value: 'interview', label: 'Interview' },
  ];

  const priceOptions = [
    { value: 'all', label: 'All Prices' },
    { value: '0-5000', label: 'Under ₹5,000' },
    { value: '5000-10000', label: '₹5,000 - ₹10,000' },
    { value: '10000-20000', label: '₹10,000 - ₹20,000' },
    { value: '20000-999999', label: 'Above ₹20,000' },
  ];

  const gradients = [
    'from-violet-500 via-purple-500 to-fuchsia-500',
    'from-blue-500 via-cyan-500 to-teal-500',
    'from-orange-500 via-red-500 to-pink-500',
    'from-emerald-500 via-green-500 to-lime-500',
    'from-indigo-500 via-blue-500 to-sky-500',
    'from-rose-500 via-pink-500 to-purple-500',
    'from-amber-500 via-yellow-500 to-orange-500',
    'from-teal-500 via-cyan-500 to-blue-500',
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-gray-900">Course Marketplace</h1>
        <p className="mt-0.5 text-sm text-gray-500">Discover trusted UPSC courses from educators and institutes.</p>
      </div>

      {/* Search Bar */}
      <div className="flex flex-wrap items-end gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="relative min-w-[16rem] flex-1">
          <svg className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search courses by title, subject, or provider..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} aria-label="Filter by stage" className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100">
          {stageOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <select value={languageFilter} onChange={(e) => setLanguageFilter(e.target.value)} aria-label="Filter by language" className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100">
          <option value="all">All Languages</option><option value="English">English</option><option value="Hindi">Hindi</option>
        </select>
        <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} aria-label="Filter by price" className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100">
          {priceOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} aria-label="Filter by subject" className="h-10 max-w-36 rounded-lg border border-slate-200 bg-slate-50 px-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100">
          <option value="all">All Subjects</option>{allSubjects.map((sub) => <option key={sub} value={sub}>{sub}</option>)}
        </select>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="popularity">Sort by Popularity</option>
            <option value="rating">Sort by Rating</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
          <button onClick={() => { setStageFilter('all'); setLanguageFilter('all'); setPriceRange('all'); setSubjectFilter('all'); }} className="h-10 shrink-0 px-1 text-xs font-medium text-indigo-600 hover:text-indigo-700">Clear filters</button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Filter bar */}
        <div className="hidden">
          <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm lg:flex-nowrap">
            <div className="order-last ml-auto flex shrink-0 items-center gap-3 pb-2"><h3 className="text-sm font-semibold text-gray-900">Filters</h3><button onClick={() => { setStageFilter('all'); setLanguageFilter('all'); setPriceRange('all'); setSubjectFilter('all'); }} className="text-xs font-medium text-indigo-600 hover:text-indigo-700">Clear</button></div>

            {/* Stage Filter */}
            <div className="min-w-40">
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">Stage</label>
              <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100">
                {stageOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>

            {/* Language Filter */}
            <div className="min-w-40">
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">Language</label>
              <select value={languageFilter} onChange={(e) => setLanguageFilter(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100">
                <option value="all">All Languages</option><option value="English">English</option><option value="Hindi">Hindi</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="min-w-44">
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">Price</label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                {priceOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Subject Filter */}
            <div className="min-w-44">
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">Subject</label>
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <option value="all">All Subjects</option>
                {allSubjects.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Course Grid */}
        <div className="w-full">
          <p className="mb-3 text-sm text-gray-500">{isLoading ? 'Loading courses...' : `${filteredCourses.length} courses found`}</p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {filteredCourses.map((course, idx) => (
              <div key={course.id} className="group w-full max-w-[19rem] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
                <div className={`relative h-28 overflow-hidden bg-gradient-to-br ${gradients[idx % gradients.length]} p-4`}>
                  <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10"></div>
                  <div className="absolute -left-4 -bottom-4 h-16 w-16 rounded-full bg-white/10"></div>
                  <div className="relative flex items-start justify-between">
                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                      {course.stage.charAt(0).toUpperCase() + course.stage.slice(1)}
                    </span>
                    {course.tags.includes('bestseller') && (
                      <span className="rounded-full bg-yellow-400 px-2.5 py-0.5 text-xs font-bold text-yellow-900">Bestseller</span>
                    )}
                    {course.tags.includes('top-rated') && (
                      <span className="rounded-full bg-green-400 px-2.5 py-0.5 text-xs font-bold text-green-900">Top Rated</span>
                    )}
                  </div>
                  <div className="absolute bottom-3 left-4">
                    <span className="rounded bg-black/20 px-2 py-1 text-xs text-white backdrop-blur-sm">{course.lessons} lessons</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">{course.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{course.provider}</p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-yellow-600">{course.rating}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`h-3.5 w-3.5 ${i < Math.floor(course.rating) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">({course.reviewsCount.toLocaleString()})</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                    <span>{course.studentsEnrolled.toLocaleString()} students</span>
                    <span>|</span>
                    <span>{course.duration}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                    <div>
                      <span className="text-lg font-bold text-gray-900">&#8377;{course.price.toLocaleString()}</span>
                      <span className="ml-2 text-sm text-gray-400 line-through">&#8377;{course.originalPrice.toLocaleString()}</span>
                      <span className="ml-2 text-xs font-medium text-green-600">
                        {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% off
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!userId) {
                        navigate('/login');
                        return;
                      }
                      setEnrollError(null);
                      setSelectedCourse(course);
                    }}
                    className="mt-3 w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 active:bg-indigo-800"
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            ))}
          </div>
          {filteredCourses.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-16">
              <svg className="h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-4 text-lg font-medium text-gray-500">No courses found</p>
              <p className="mt-1 text-sm text-gray-400">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true" aria-labelledby="enrollment-title">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 id="enrollment-title" className="text-xl font-bold text-slate-900">Enroll in this course?</h2>
            <p className="mt-2 text-sm text-slate-600">
              Do you want to enroll in <span className="font-semibold">{selectedCourse.title}</span> now?
            </p>
            {enrollError && <p className="mt-3 text-sm text-rose-600">{enrollError}</p>}
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setSelectedCourse(null)} disabled={isEnrolling} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-50">No</button>
              <button type="button" onClick={confirmEnrollment} disabled={isEnrolling} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
                {isEnrolling ? 'Enrolling...' : 'Yes, enroll'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

