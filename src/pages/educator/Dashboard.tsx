import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { mockEducators, mockCourses, mockReviews } from '@/lib/data';
import { useAppSelector } from '@/store/hooks';
import { useGetProfileQuery, useUpdateEducatorProfileMutation } from '@/store/profileApi';
import { useSnackbar } from 'notistack';

export default function EducatorDashboard() {
  const fallbackEducator = mockEducators.find((e) => e.id === 'edu-1')!;
  const session = useAppSelector((state) => state.auth.session);
  const { enqueueSnackbar } = useSnackbar();
  const { data: profile, refetch } = useGetProfileQuery(
    { role: 'educator', userId: session?.user.id ?? '' },
    { skip: !session?.user.id },
  );
  const [updateEducatorProfile, { isLoading: isSaving }] = useUpdateEducatorProfileMutation();
  const educatorCourses = mockCourses.filter((c) => c.providerId === 'edu-1');
  const educatorCourseIds = educatorCourses.map((c) => c.id);
  const recentReviews = mockReviews.filter((r) => r.courseId && educatorCourseIds.includes(r.courseId));

  const [editMode, setEditMode] = useState(false);
  const [bio, setBio] = useState('');
  const [specializations, setSpecializations] = useState('');
  const [experience, setExperience] = useState('0');

  useEffect(() => {
    if (!profile || editMode) return;
    setBio(profile.bio ?? fallbackEducator.bio);
    setSpecializations((profile.specializations ?? fallbackEducator.specializations).join(', '));
    setExperience(String(profile.experience ?? fallbackEducator.experience));
  }, [profile, editMode, fallbackEducator]);

  const profileUser = profile?.userId && typeof profile.userId === 'object' ? profile.userId : undefined;
  const educatorName = session?.user.name
    ?? [profileUser?.firstName, profileUser?.lastName].filter(Boolean).join(' ')
    ?? fallbackEducator.name;
  const studentsCount = profile?.studentsCount ?? 0;
  const coursesCount = profile?.coursesCount ?? 0;
  const rating = profile?.rating ?? 0;

  const handleSaveProfile = async () => {
    if (!session?.user.id) return;
    const parsedExperience = Number(experience);
    if (!Number.isInteger(parsedExperience) || parsedExperience < 0) {
      enqueueSnackbar('Experience must be a whole number of years.', { variant: 'error' });
      return;
    }

    try {
      await updateEducatorProfile({
        userId: session.user.id,
        bio: bio.trim(),
        specializations: specializations.split(',').map((item) => item.trim()).filter(Boolean),
        experience: parsedExperience,
      }).unwrap();
      await refetch();
      setEditMode(false);
      enqueueSnackbar('Educator profile updated successfully.', { variant: 'success' });
    } catch {
      enqueueSnackbar('Unable to update your educator profile.', { variant: 'error' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Educator Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, {educatorName}</p>
      </div>

      {/* Profile Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
          <button
            onClick={() => (editMode ? handleSaveProfile() : setEditMode(true))}
            disabled={isSaving}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              editMode
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isSaving ? 'Saving...' : editMode ? 'Save Profile' : 'Edit Profile'}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white text-3xl font-bold">{educatorName.charAt(0).toUpperCase()}</span>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-gray-900">{educatorName}</h3>
              {profile?.verified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Verified Educator
                </span>
              )}
            </div>

            {editMode ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specializations (comma separated)
                  </label>
                  <input
                    type="text"
                    value={specializations}
                    onChange={(e) => setSpecializations(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Years of experience</label>
                  <input
                    type="number"
                    min="0"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            ) : (
              <>
                <p className="text-gray-600 text-sm leading-relaxed">{bio}</p>
                <div className="flex flex-wrap gap-2">
                  {specializations.split(',').map((spec) => (
                    <span
                      key={spec.trim()}
                      className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium"
                    >
                      {spec.trim()}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <span>{experience} years experience</span>
                  <span>{session?.user.email}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Students',
            value: studentsCount.toLocaleString(),
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            ),
            color: 'bg-blue-50 text-blue-600',
          },
          {
            label: 'Courses',
            value: coursesCount.toLocaleString(),
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            ),
            color: 'bg-purple-50 text-purple-600',
          },
          {
            label: 'Rating',
            value: rating.toFixed(1),
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            ),
            color: 'bg-yellow-50 text-yellow-600',
          },
          {
            label: 'Revenue',
            value: '—',
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ),
            color: 'bg-green-50 text-green-600',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Reviews */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Reviews</h2>
        {recentReviews.length > 0 ? (
          <div className="space-y-4">
            {recentReviews.map((review) => {
              const course = mockCourses.find((c) => c.id === review.courseId);
              return (
                <div
                  key={review.id}
                  className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 text-sm font-medium">
                          {review.userName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{review.userName}</p>
                        <p className="text-xs text-gray-500">
                          {course?.title} &middot; {review.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-200'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No reviews yet for your courses.</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/educator/courses"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors group"
          >
            <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Create Course</p>
              <p className="text-xs text-gray-500">Add a new course or test</p>
            </div>
          </Link>
          <Link
            to="/educator/sessions"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors group"
          >
            <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Schedule Session</p>
              <p className="text-xs text-gray-500">Schedule a live class</p>
            </div>
          </Link>
          <Link
            to="/educator/revenue"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-yellow-300 hover:bg-yellow-50 transition-colors group"
          >
            <div className="p-2 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition-colors">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">View Revenue</p>
              <p className="text-xs text-gray-500">Track your earnings</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

