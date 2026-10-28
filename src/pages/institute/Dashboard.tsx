import { Link } from 'react-router-dom';
import { mockCourses, mockReviews } from '@/lib/data';
import { useAppSelector } from '@/store/hooks';
import { useGetProfileQuery } from '@/store/profileApi';

const instituteCourses = mockCourses.filter((c) => c.providerId === 'inst-1');

const recentEnrollments = [
  { id: 1, student: 'Ananya Gupta', course: 'Complete UPSC Prelims 2026 - GS Foundation', date: '2026-02-08' },
  { id: 2, student: 'Vikram Patel', course: 'Economy for UPSC - Beginner to Advanced', date: '2026-02-07' },
  { id: 3, student: 'Neha Srivastava', course: 'Complete UPSC Prelims 2026 - GS Foundation', date: '2026-02-07' },
  { id: 4, student: 'Amit Kumar', course: 'Economy for UPSC - Beginner to Advanced', date: '2026-02-06' },
  { id: 5, student: 'Pooja Yadav', course: 'Complete UPSC Prelims 2026 - GS Foundation', date: '2026-02-06' },
  { id: 6, student: 'Rohit Sharma', course: 'Economy for UPSC - Beginner to Advanced', date: '2026-02-05' },
];

const revenueData = [
  { month: 'Sep', amount: 820000 },
  { month: 'Oct', amount: 960000 },
  { month: 'Nov', amount: 1050000 },
  { month: 'Dec', amount: 1120000 },
  { month: 'Jan', amount: 1250000 },
  { month: 'Feb', amount: 980000 },
];

const maxRevenue = Math.max(...revenueData.map((d) => d.amount));

export default function InstituteDashboard() {
  const session = useAppSelector((state) => state.auth.session);
  const { data: profile } = useGetProfileQuery(
    { role: 'institute', userId: session?.user.id ?? '' },
    { skip: !session?.user.id },
  );
  const instituteName = profile?.instituteName ?? session?.user.name ?? 'Institute';
  const studentsCount = profile?.studentsCount ?? 0;
  const coursesCount = profile?.coursesCount ?? 0;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Welcome back, {instituteName}</h1>
            <p className="mt-2 text-indigo-200">
              Here is what is happening with your institute today. Keep up the great work!
            </p>
          </div>
          <div className="flex items-center gap-2">
            {profile?.verified && <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">Verified Institute</span>}
            <span className="bg-green-400/20 text-green-200 px-3 py-1 rounded-full text-sm font-medium">Active</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Students', value: studentsCount.toLocaleString(), change: '', changeColor: 'text-green-600', bg: 'bg-blue-50', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 00-6 0z', iconColor: 'text-blue-600' },
          { label: 'Active Courses', value: coursesCount.toLocaleString(), change: '', changeColor: 'text-green-600', bg: 'bg-purple-50', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', iconColor: 'text-purple-600' },
          { label: 'Revenue This Month', value: '₹12,50,000', change: '+18%', changeColor: 'text-green-600', bg: 'bg-green-50', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', iconColor: 'text-green-600' },
          { label: 'Average Rating', value: '4.7', change: 'out of 5.0', changeColor: 'text-yellow-600', bg: 'bg-yellow-50', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z', iconColor: 'text-yellow-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
                <svg className={`w-6 h-6 ${stat.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                </svg>
              </div>
              <span className={`text-xs font-medium ${stat.changeColor}`}>{stat.change}</span>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart & Recent Enrollments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
              <p className="text-sm text-gray-500 mt-1">Last 6 months</p>
            </div>
            <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">+18% growth</span>
          </div>
          <div className="flex items-end gap-4 h-48">
            {revenueData.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-medium text-gray-700">
                  ₹{(d.amount / 100000).toFixed(1)}L
                </span>
                <div
                  className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-md transition-all duration-500 hover:from-indigo-700 hover:to-indigo-500"
                  style={{ height: `${(d.amount / maxRevenue) * 100}%`, minHeight: '8px' }}
                />
                <span className="text-xs text-gray-500 font-medium">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Enrollments */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Recent Enrollments</h2>
              <p className="text-sm text-gray-500 mt-1">Latest student enrollments</p>
            </div>
            <Link to="/institute/analytics" className="text-indigo-600 text-sm font-medium hover:text-indigo-700">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentEnrollments.map((enrollment) => (
              <div key={enrollment.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-600 font-semibold text-sm">
                    {enrollment.student.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{enrollment.student}</p>
                  <p className="text-xs text-gray-500 truncate">{enrollment.course}</p>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{enrollment.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Courses */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Top Performing Courses</h2>
            <p className="text-sm text-gray-500 mt-1">Your best courses by student enrollment</p>
          </div>
          <Link to="/institute/courses" className="text-indigo-600 text-sm font-medium hover:text-indigo-700">
            Manage Courses
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 pr-4">Course Name</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Students</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Revenue</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Rating</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 pl-4">Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {instituteCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{course.title}</p>
                        <p className="text-xs text-gray-500">{course.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-medium text-gray-900">{course.studentsEnrolled.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-medium text-gray-900">
                      ₹{(course.studentsEnrolled * course.price * 0.85 / 100).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500 text-sm">★</span>
                      <span className="text-sm font-medium text-gray-900">{course.rating}</span>
                      <span className="text-xs text-gray-400">({course.reviewsCount})</span>
                    </div>
                  </td>
                  <td className="py-4 pl-4">
                    <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                      course.stage === 'prelims' ? 'bg-blue-100 text-blue-700' :
                      course.stage === 'mains' ? 'bg-green-100 text-green-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {course.stage.charAt(0).toUpperCase() + course.stage.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions & Student Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/institute/courses"
              className="flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-dashed border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-700">Create Course</span>
            </Link>
            <Link
              to="/institute/classes"
              className="flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-dashed border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all group"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-green-700">Schedule Live Class</span>
            </Link>
            <Link
              to="/institute/analytics"
              className="flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-dashed border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all group"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700">View Analytics</span>
            </Link>
          </div>
        </div>

        {/* Student Feedback */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Student Feedback</h2>
              <p className="text-sm text-gray-500 mt-1">Recent reviews from your students</p>
            </div>
          </div>
          <div className="space-y-4">
            {mockReviews.map((review) => (
              <div key={review.id} className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 text-sm font-semibold">{review.userName.charAt(0)}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{review.userName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`text-sm ${i < review.rating ? 'text-yellow-400' : 'text-gray-200'}`}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                <span className="text-xs text-gray-400 mt-2 block">{review.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

