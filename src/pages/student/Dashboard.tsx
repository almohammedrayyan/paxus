import { useState } from 'react';
import { mockCourses, mockLiveClasses, sampleMockTest, mockNotifications, mockStudents } from '@/lib/data';

export default function StudentDashboard() {
  const student = mockStudents[0];
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const dailyQuestion = sampleMockTest.questions[0];
  const upcomingClasses = mockLiveClasses.filter((c) => c.status === 'upcoming' || c.status === 'live');
  const recommendedCourses = mockCourses.filter((c) => c.featured).slice(0, 3);
  const unreadNotifications = mockNotifications.filter((n) => !n.read);

  const currentAffairs = [
    { id: 1, title: 'Union Budget 2026-27: Key Highlights for UPSC', category: 'Economy', date: '2026-02-07' },
    { id: 2, title: 'India-France Strategic Partnership Enhanced', category: 'International Relations', date: '2026-02-06' },
    { id: 3, title: 'New National Education Policy Amendments', category: 'Governance', date: '2026-02-05' },
    { id: 4, title: 'Supreme Court Verdict on Electoral Bonds', category: 'Polity', date: '2026-02-04' },
  ];

  const handleQuizSubmit = () => {
    if (quizAnswer !== null) {
      setQuizSubmitted(true);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10"></div>
        <div className="absolute right-20 bottom-0 -mb-8 h-32 w-32 rounded-full bg-white/5"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold">Welcome back, {student.name}!</h1>
          <p className="mt-2 text-indigo-100">Keep up the great work on your UPSC journey. You are doing amazing!</p>
          <div className="mt-6 flex flex-wrap gap-6">
            <div className="rounded-xl bg-white/15 px-5 py-3 backdrop-blur-sm">
              <p className="text-sm text-indigo-200">Study Streak</p>
              <p className="text-2xl font-bold">{student.studyStreak} days</p>
            </div>
            <div className="rounded-xl bg-white/15 px-5 py-3 backdrop-blur-sm">
              <p className="text-sm text-indigo-200">Overall Score</p>
              <p className="text-2xl font-bold">{student.overallScore}%</p>
            </div>
            <div className="rounded-xl bg-white/15 px-5 py-3 backdrop-blur-sm">
              <p className="text-sm text-indigo-200">Target Exam</p>
              <p className="text-2xl font-bold">{student.targetExam}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Enrolled Courses</p>
              <p className="text-2xl font-bold text-gray-900">{student.enrolledCourses.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed Tests</p>
              <p className="text-2xl font-bold text-gray-900">{student.completedTests.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Study Streak</p>
              <p className="text-2xl font-bold text-gray-900">{student.studyStreak} days</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Overall Score</p>
              <p className="text-2xl font-bold text-gray-900">{student.overallScore}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Current Affairs Highlights */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">Current Affairs Highlights</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {currentAffairs.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-gray-50">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    <div className="mt-1 flex items-center gap-3">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                        {item.category}
                      </span>
                      <span className="text-xs text-gray-400">{item.date}</span>
                    </div>
                  </div>
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Live Classes */}
        <div>
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Live Classes</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {upcomingClasses.map((cls) => (
                <div key={cls.id} className="px-6 py-4">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${cls.status === 'live' ? 'animate-pulse bg-red-500' : 'bg-indigo-500'}`}>
                      {cls.status === 'live' ? 'LIVE' : cls.subject.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{cls.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">{cls.educator}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                          {new Date(cls.scheduledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} at{' '}
                          {new Date(cls.scheduledAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-xs text-gray-400">| {cls.duration} min</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {upcomingClasses.length === 0 && (
                <div className="px-6 py-8 text-center text-sm text-gray-400">No upcoming classes</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Daily Quiz Section */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Daily Quiz</h2>
            <span className="inline-flex items-center rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700">
              {dailyQuestion.subject} | {dailyQuestion.difficulty}
            </span>
          </div>
        </div>
        <div className="p-6">
          <p className="mb-5 whitespace-pre-line text-gray-800 leading-relaxed">{dailyQuestion.text}</p>
          <div className="space-y-3">
            {dailyQuestion.options.map((option, idx) => (
              <label
                key={idx}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-all ${
                  quizSubmitted
                    ? idx === dailyQuestion.correctAnswer
                      ? 'border-green-500 bg-green-50'
                      : quizAnswer === idx
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 bg-white'
                    : quizAnswer === idx
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="quiz"
                  value={idx}
                  checked={quizAnswer === idx}
                  onChange={() => !quizSubmitted && setQuizAnswer(idx)}
                  disabled={quizSubmitted}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="flex-1 text-sm text-gray-700">
                  <span className="mr-2 font-medium text-gray-500">({String.fromCharCode(65 + idx)})</span>
                  {option}
                </span>
                {quizSubmitted && idx === dailyQuestion.correctAnswer && (
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </label>
            ))}
          </div>
          {!quizSubmitted ? (
            <button
              onClick={handleQuizSubmit}
              disabled={quizAnswer === null}
              className="mt-5 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Submit Answer
            </button>
          ) : (
            <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm font-medium text-blue-900">
                {quizAnswer === dailyQuestion.correctAnswer ? 'Correct!' : 'Incorrect!'}
              </p>
              <p className="mt-1 text-sm text-blue-700">{dailyQuestion.explanation}</p>
            </div>
          )}
        </div>
      </div>

      {/* Recommended Courses */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Recommended Courses</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recommendedCourses.map((course) => (
            <div key={course.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5">
              <div className="h-40 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
                <div className="flex items-start justify-between">
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {course.stage.charAt(0).toUpperCase() + course.stage.slice(1)}
                  </span>
                  {course.tags.includes('bestseller') && (
                    <span className="rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-yellow-900">
                      Bestseller
                    </span>
                  )}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-gray-900 line-clamp-2">{course.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{course.provider}</p>
                <div className="mt-2 flex items-center gap-1">
                  <span className="text-sm font-medium text-yellow-600">{course.rating}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`h-4 w-4 ${i < Math.floor(course.rating) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">({course.reviewsCount})</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-gray-900">&#8377;{course.price.toLocaleString()}</span>
                    <span className="ml-2 text-sm text-gray-400 line-through">&#8377;{course.originalPrice.toLocaleString()}</span>
                  </div>
                  <span className="text-xs text-gray-500">{course.studentsEnrolled.toLocaleString()} students</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications Preview */}
      {unreadNotifications.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
              <svg className="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-amber-900">You have {unreadNotifications.length} unread notifications</p>
              <p className="text-sm text-amber-700">{unreadNotifications[0].title}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

