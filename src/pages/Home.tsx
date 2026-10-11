import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { mockCourses, mockTestSeries, mockMentors, platformAnalytics } from '@/lib/data';

export default function HomePage() {
  const featuredCourses = mockCourses.filter((c) => c.featured).slice(0, 4);
  const topTestSeries = mockTestSeries.slice(0, 3);
  const topMentors = mockMentors.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Provider registration — shown first so partners can get started immediately */}
      <section className="relative isolate overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(124,58,237,.42),transparent_31%),radial-gradient(circle_at_82%_80%,rgba(14,165,233,.24),transparent_30%)]" />
        <div className="absolute -top-24 right-[10%] h-72 w-72 rounded-full border border-white/10" />
        <div className="absolute -bottom-32 left-[35%] h-80 w-80 rounded-full border border-white/5" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-violet-300/30 bg-violet-400/10 px-4 py-2 text-sm font-medium text-violet-100">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Grow your education business with ExamPrep
            </p>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Build your next chapter with <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-sky-300">India&apos;s aspirants.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Launch courses, live learning, and study material for the learners who need it most. Choose how you create, and we&apos;ll tailor your onboarding.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-6xl gap-4 md:grid-cols-3">
            {[
              { role: 'institute', label: 'Coaching institute', description: 'Bring your classes, test series, and faculty to one powerful storefront.', accent: 'from-violet-500 to-indigo-500', icon: '⌂' },
              { role: 'educator', label: 'Independent educator', description: 'Teach through courses, live sessions, and personal mentorship.', accent: 'from-sky-500 to-cyan-500', icon: '✦' },
              { role: 'publisher', label: 'Publisher', description: 'Put books, eBooks, and trusted learning resources in reach of more aspirants.', accent: 'from-fuchsia-500 to-rose-500', icon: '▤' },
            ].map((option) => (
              <Link
                key={option.role}
                to={`/signup?role=${option.role}`}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.07] p-6 text-left shadow-2xl shadow-black/10 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.12] focus:outline-none focus:ring-2 focus:ring-violet-300"
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${option.accent} text-xl font-bold shadow-lg`} aria-hidden="true">{option.icon}</div>
                <h2 className="mt-6 text-xl font-semibold">{option.label}</h2>
                <p className="mt-2 min-h-12 text-sm leading-6 text-slate-300">{option.description}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white">
                  Start registration <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </Link>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-slate-400">Free to join · Set up in minutes · Built for UPSC education</p>
        </div>
      </section>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              Your One-Stop Platform for UPSC Exam Preparation
            </h1>
            <p className="mt-6 text-lg text-indigo-100 leading-relaxed">
              Access courses, test series, study materials, and mentorship from India&apos;s top coaching institutes and educators. Compare, choose, and ace your UPSC journey.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/signup" className="bg-white text-indigo-700 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition">
                Get Started Free
              </Link>
              <Link to="/student/courses" className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition">
                Explore Courses
              </Link>
            </div>
            <div className="mt-12 flex flex-wrap gap-8 text-sm">
              <div>
                <div className="text-2xl font-bold">{(platformAnalytics.totalStudents / 1000).toFixed(0)}K+</div>
                <div className="text-indigo-200">Active Students</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{platformAnalytics.totalCourses}+</div>
                <div className="text-indigo-200">Courses</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{platformAnalytics.totalInstitutes}+</div>
                <div className="text-indigo-200">Institutes</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{platformAnalytics.totalEducators}+</div>
                <div className="text-indigo-200">Expert Educators</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900">How ExamPrep Works</h2>
          <p className="mt-3 text-center text-gray-500 max-w-2xl mx-auto">
            Like Swiggy for food, ExamPrep aggregates the best UPSC preparation resources in one place
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Sign Up', desc: 'Create your profile and set your exam preferences, optional subject, and language.' },
              { step: '2', title: 'Browse & Compare', desc: 'Explore courses, test series, and resources from multiple top providers.' },
              { step: '3', title: 'Learn & Practice', desc: 'Access video lectures, study materials, mock tests, and mentorship sessions.' },
              { step: '4', title: 'Track Progress', desc: 'Monitor your preparation with analytics, scores, and personalized recommendations.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-indigo-600 font-bold text-lg">{item.step}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Courses</h2>
              <p className="mt-1 text-gray-500">Top-rated courses from leading institutes and educators</p>
            </div>
            <Link to="/student/courses" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              View All →
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-40 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-sm font-medium px-3 py-1 bg-black/20 rounded-full">{course.stage.toUpperCase()}</span>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <span>{course.provider}</span>
                    <span>|</span>
                    <span>{course.language}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{course.title}</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-yellow-500 text-sm">{'★'.repeat(Math.round(course.rating))}</span>
                    <span className="text-xs text-gray-500">{course.rating} ({course.reviewsCount})</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-gray-900">₹{course.price.toLocaleString()}</span>
                      <span className="text-sm text-gray-400 line-through ml-2">₹{course.originalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {course.studentsEnrolled.toLocaleString()} students | {course.lessons} lessons
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Test Series */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Popular Test Series</h2>
              <p className="mt-1 text-gray-500">Practice with India&apos;s most attempted mock tests</p>
            </div>
            <Link to="/student/tests" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              View All →
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {topTestSeries.map((ts) => (
              <div key={ts.id} className="bg-gray-50 rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    ts.stage === 'prelims' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {ts.stage.toUpperCase()}
                  </span>
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">{ts.category}</span>
                </div>
                <h3 className="font-semibold text-gray-900">{ts.title}</h3>
                <p className="mt-2 text-sm text-gray-500 line-clamp-2">{ts.description}</p>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                  <div className="bg-white rounded-lg p-2 border">
                    <div className="font-bold text-gray-900">{ts.totalTests}</div>
                    <div className="text-xs text-gray-500">Tests</div>
                  </div>
                  <div className="bg-white rounded-lg p-2 border">
                    <div className="font-bold text-gray-900">{ts.totalQuestions}</div>
                    <div className="text-xs text-gray-500">Questions</div>
                  </div>
                  <div className="bg-white rounded-lg p-2 border">
                    <div className="font-bold text-gray-900">{(ts.attemptedBy / 1000).toFixed(0)}K</div>
                    <div className="text-xs text-gray-500">Attempted</div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm font-medium">{ts.rating}</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">₹{ts.price.toLocaleString()}</span>
                </div>
                <div className="mt-2 text-xs text-gray-500">by {ts.provider}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mentors */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Top Mentors</h2>
              <p className="mt-1 text-gray-500">Get guidance from UPSC toppers and experienced mentors</p>
            </div>
            <Link to="/student/mentorship" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              View All →
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topMentors.map((mentor) => (
              <div key={mentor.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full mx-auto flex items-center justify-center">
                  <span className="text-indigo-600 font-bold text-xl">{mentor.name.charAt(0)}</span>
                </div>
                <h3 className="mt-3 font-semibold text-gray-900 text-sm">{mentor.name}</h3>
                <div className="mt-1 flex flex-wrap justify-center gap-1">
                  {mentor.specialization.slice(0, 2).map((s) => (
                    <span key={s} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm font-medium">{mentor.rating}</span>
                  <span className="text-xs text-gray-400">({mentor.sessionsCompleted} sessions)</span>
                </div>
                <div className="mt-3 text-lg font-bold text-gray-900">₹{mentor.pricePerSession}/session</div>
                <button className="mt-3 w-full py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 transition">
                  Book Session
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Subjects */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center">Browse by Subject</h2>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'History', color: 'from-red-400 to-red-600' },
              { name: 'Geography', color: 'from-green-400 to-green-600' },
              { name: 'Polity', color: 'from-blue-400 to-blue-600' },
              { name: 'Economy', color: 'from-yellow-400 to-yellow-600' },
              { name: 'Science & Tech', color: 'from-purple-400 to-purple-600' },
              { name: 'Environment', color: 'from-teal-400 to-teal-600' },
              { name: 'Ethics', color: 'from-pink-400 to-pink-600' },
              { name: 'Current Affairs', color: 'from-orange-400 to-orange-600' },
              { name: 'Essay', color: 'from-indigo-400 to-indigo-600' },
              { name: 'Art & Culture', color: 'from-rose-400 to-rose-600' },
              { name: 'CSAT', color: 'from-cyan-400 to-cyan-600' },
              { name: 'Optional', color: 'from-amber-400 to-amber-600' },
            ].map((subject) => (
              <Link
                key={subject.name}
                to={`/student/courses?subject=${encodeURIComponent(subject.name)}`}
                className={`bg-gradient-to-br ${subject.color} text-white rounded-xl p-4 text-center font-semibold hover:opacity-90 transition`}
              >
                {subject.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">EP</span>
                </div>
                <span className="text-xl font-bold text-white">ExamPrep</span>
              </div>
              <p className="mt-3 text-sm">
                India&apos;s leading aggregator platform for UPSC and competitive exam preparation.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">For Students</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/student/courses" className="hover:text-white">Browse Courses</Link></li>
                <li><Link to="/student/tests" className="hover:text-white">Test Series</Link></li>
                <li><Link to="/student/resources" className="hover:text-white">Study Materials</Link></li>
                <li><Link to="/student/mentorship" className="hover:text-white">Find a Mentor</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">For Providers</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/signup" className="hover:text-white">Partner with Us</Link></li>
                <li><Link to="/institute" className="hover:text-white">Institute Dashboard</Link></li>
                <li><Link to="/educator" className="hover:text-white">Educator Portal</Link></li>
                <li><Link to="/publisher" className="hover:text-white">Publisher Portal</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="#" className="hover:text-white">Help Center</Link></li>
                <li><Link to="#" className="hover:text-white">Terms of Service</Link></li>
                <li><Link to="#" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link to="#" className="hover:text-white">Contact Us</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
            © 2026 ExamPrep. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

