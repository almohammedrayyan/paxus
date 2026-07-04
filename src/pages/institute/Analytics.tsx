import { mockCourses, platformAnalytics } from '@/lib/data';

export default function InstituteAnalyticsPage() {
  const instituteCourses = mockCourses.filter(c => c.providerId === 'inst-1');
  const avgRating = (instituteCourses.reduce((sum, c) => sum + c.rating, 0) / instituteCourses.length).toFixed(1);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Performance Analytics</h1>
      <p className="mt-1 text-gray-500">Track your institute&apos;s performance and student engagement</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Views', value: '45,200', change: '+12%' },
          { label: 'Enrollments (Month)', value: '1,240', change: '+8%' },
          { label: 'Avg Completion Rate', value: '67%', change: '+3%' },
          { label: 'Revenue Growth', value: '+18%', change: 'vs last month' },
        ].map(metric => (
          <div key={metric.label} className="bg-white rounded-xl border p-4">
            <div className="text-sm text-gray-500">{metric.label}</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</div>
            <div className="text-xs text-green-600 mt-1">{metric.change}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Student Performance (Avg Scores)</h3>
          <div className="space-y-3">
            {instituteCourses.map(course => (
              <div key={course.id} className="flex items-center gap-3">
                <div className="w-32 text-sm text-gray-600 truncate">{course.title.split(' - ')[0]}</div>
                <div className="flex-1 bg-gray-100 rounded-full h-4">
                  <div className="bg-indigo-500 rounded-full h-4" style={{ width: `${Math.round(course.rating * 20)}%` }}></div>
                </div>
                <span className="text-sm font-medium w-12 text-right">{(course.rating * 20).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Subject-wise Enrollments</h3>
          <div className="space-y-3">
            {platformAnalytics.topSubjects.slice(0, 5).map(s => (
              <div key={s.subject} className="flex items-center gap-3">
                <div className="w-28 text-sm text-gray-600">{s.subject}</div>
                <div className="flex-1 bg-gray-100 rounded-full h-4">
                  <div className="bg-green-500 rounded-full h-4" style={{ width: `${(s.searches / 450)}%` }}></div>
                </div>
                <span className="text-sm font-medium w-16 text-right">{(s.searches / 100).toFixed(0)} users</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Course Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="pb-3 pr-4">Course</th>
                <th className="pb-3 pr-4">Students</th>
                <th className="pb-3 pr-4">Rating</th>
                <th className="pb-3 pr-4">Reviews</th>
                <th className="pb-3 pr-4">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {instituteCourses.map(course => (
                <tr key={course.id} className="border-b last:border-0">
                  <td className="py-3 pr-4 font-medium text-gray-900">{course.title}</td>
                  <td className="py-3 pr-4">{course.studentsEnrolled.toLocaleString()}</td>
                  <td className="py-3 pr-4"><span className="text-yellow-500">★</span> {course.rating}</td>
                  <td className="py-3 pr-4">{course.reviewsCount}</td>
                  <td className="py-3 pr-4">₹{(course.studentsEnrolled * course.price * 0.1 / 1000).toFixed(0)}K</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">City-wise Student Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {platformAnalytics.cityWiseUsers.slice(0, 8).map(city => (
            <div key={city.city} className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-semibold text-gray-900">{(city.users / 1000).toFixed(1)}K</div>
              <div className="text-xs text-gray-500">{city.city}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Feedback Summary</h3>
        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900">{avgRating}</div>
            <div className="text-yellow-500 mt-1">★★★★★</div>
            <div className="text-sm text-gray-500 mt-1">Average Rating</div>
          </div>
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map(star => (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="w-8">{star}★</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div className="bg-yellow-400 rounded-full h-2" style={{ width: `${star === 5 ? 60 : star === 4 ? 25 : star === 3 ? 10 : star === 2 ? 3 : 2}%` }}></div>
                </div>
                <span className="w-8 text-gray-400 text-right">{star === 5 ? '60%' : star === 4 ? '25%' : star === 3 ? '10%' : star === 2 ? '3%' : '2%'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

