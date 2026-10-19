import { useState } from 'react';
import type { Course } from '@/lib/types';

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'pdf' | 'quiz';
}

interface TestQuestion {
  id: string;
  text: string;
  options: [string, string, string, string];
  correctAnswer: number;
  explanation: string;
}

export default function EducatorCoursesPage() {
  // Courses will be populated from the list API when that endpoint is available.
  const educatorCourses: Course[] = [];
  const showCourseDirectory = false;

  // Course creation form state
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseCategory, setCourseCategory] = useState('');
  const [courseSubjects, setCourseSubjects] = useState('');
  const [courseStage, setCourseStage] = useState<string>('all');
  const [coursePrice, setCoursePrice] = useState('');
  const [courseLanguage, setCourseLanguage] = useState('English');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonType, setNewLessonType] = useState<'video' | 'pdf' | 'quiz'>('video');

  // Test series creation state
  const [showTestForm, setShowTestForm] = useState(false);
  const [testTitle, setTestTitle] = useState('');
  const [testSubject, setTestSubject] = useState('');
  const [testStage, setTestStage] = useState<string>('prelims');
  const [testCount, setTestCount] = useState('');
  const [testQuestions, setTestQuestions] = useState<TestQuestion[]>([]);
  const [qText, setQText] = useState('');
  const [qOptions, setQOptions] = useState<[string, string, string, string]>(['', '', '', '']);
  const [qCorrect, setQCorrect] = useState(0);
  const [qExplanation, setQExplanation] = useState('');

  const addLesson = () => {
    if (!newLessonTitle.trim()) return;
    setLessons([
      ...lessons,
      { id: `lesson-${Date.now()}`, title: newLessonTitle, type: newLessonType },
    ]);
    setNewLessonTitle('');
  };

  const removeLesson = (id: string) => {
    setLessons(lessons.filter((l) => l.id !== id));
  };

  const moveLessonUp = (index: number) => {
    if (index === 0) return;
    const updated = [...lessons];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setLessons(updated);
  };

  const moveLessonDown = (index: number) => {
    if (index === lessons.length - 1) return;
    const updated = [...lessons];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setLessons(updated);
  };

  const addQuestion = () => {
    if (!qText.trim() || qOptions.some((o) => !o.trim())) return;
    setTestQuestions([
      ...testQuestions,
      {
        id: `tq-${Date.now()}`,
        text: qText,
        options: [...qOptions],
        correctAnswer: qCorrect,
        explanation: qExplanation,
      },
    ]);
    setQText('');
    setQOptions(['', '', '', '']);
    setQCorrect(0);
    setQExplanation('');
  };

  const removeQuestion = (id: string) => {
    setTestQuestions(testQuestions.filter((q) => q.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Courses &amp; Tests</h1>
          <p className="text-gray-500 mt-1">Manage your courses and create new content</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setShowCourseForm(!showCourseForm);
              setShowTestForm(false);
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            {showCourseForm ? 'Hide Course Form' : '+ New Course'}
          </button>
          <button
            onClick={() => {
              setShowTestForm(!showTestForm);
              setShowCourseForm(false);
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
          >
            {showTestForm ? 'Hide Test Form' : '+ New Test Series'}
          </button>
        </div>
      </div>

      {showCourseDirectory && (
        <>
      {/* Existing Courses List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Your Courses ({educatorCourses.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {educatorCourses.map((course) => (
            <div
              key={course.id}
              className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm">{course.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{course.category} &middot; {course.stage}</p>
                </div>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  Active
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-4 line-clamp-2">{course.description}</p>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-sm font-bold text-gray-900">
                    {course.studentsEnrolled.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">Students</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-sm font-bold text-gray-900">{course.rating}</p>
                  <p className="text-xs text-gray-500">Rating</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-sm font-bold text-gray-900">
                    {'\u20B9'}{course.price.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">Price</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-1.5 text-xs font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">
                  Edit
                </button>
                <button className="flex-1 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

        </>
      )}

      {/* Create New Course Form */}
      {showCourseForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Create New Course</h2>
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                <input
                  type="text"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="e.g., Complete GS Mains Course"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={courseCategory}
                  onChange={(e) => setCourseCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select category</option>
                  <option value="Foundation">Foundation</option>
                  <option value="Subject-wise">Subject-wise</option>
                  <option value="Answer Writing">Answer Writing</option>
                  <option value="Optional">Optional</option>
                  <option value="CSAT">CSAT</option>
                  <option value="Current Affairs">Current Affairs</option>
                  <option value="Crash Course">Crash Course</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
                rows={3}
                placeholder="Describe your course in detail..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subjects (comma separated tags)
              </label>
              <input
                type="text"
                value={courseSubjects}
                onChange={(e) => setCourseSubjects(e.target.value)}
                placeholder="e.g., Polity, Governance, Ethics"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {courseSubjects && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {courseSubjects
                    .split(',')
                    .filter((s) => s.trim())
                    .map((s) => (
                      <span
                        key={s.trim()}
                        className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded-full"
                      >
                        {s.trim()}
                      </span>
                    ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                <select
                  value={courseStage}
                  onChange={(e) => setCourseStage(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="prelims">Prelims</option>
                  <option value="mains">Mains</option>
                  <option value="interview">Interview</option>
                  <option value="all">All Stages</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price ({'\u20B9'})
                </label>
                <input
                  type="number"
                  value={coursePrice}
                  onChange={(e) => setCoursePrice(e.target.value)}
                  placeholder="e.g., 4999"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                <select
                  value={courseLanguage}
                  onChange={(e) => setCourseLanguage(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Bilingual">Bilingual (Hindi + English)</option>
                </select>
              </div>
            </div>

            {/* Lesson Builder */}
            <div className="border-t border-gray-200 pt-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Lesson Builder</h3>
              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  value={newLessonTitle}
                  onChange={(e) => setNewLessonTitle(e.target.value)}
                  placeholder="Lesson title"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <select
                  value={newLessonType}
                  onChange={(e) => setNewLessonType(e.target.value as 'video' | 'pdf' | 'quiz')}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="video">Video</option>
                  <option value="pdf">PDF</option>
                  <option value="quiz">Quiz</option>
                </select>
                <button
                  onClick={addLesson}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Add
                </button>
              </div>

              {lessons.length > 0 ? (
                <div className="space-y-2">
                  {lessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <span className="text-xs text-gray-400 font-mono w-6 text-center">
                        {index + 1}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          lesson.type === 'video'
                            ? 'bg-blue-100 text-blue-700'
                            : lesson.type === 'pdf'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {lesson.type.toUpperCase()}
                      </span>
                      <span className="flex-1 text-sm text-gray-700">{lesson.title}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveLessonUp(index)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Move up"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => moveLessonDown(index)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Move down"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => removeLesson(lesson.id)}
                          className="p-1 text-red-400 hover:text-red-600"
                          title="Remove"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                  <svg className="w-10 h-10 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm text-gray-400">Add lessons to your course using the form above</p>
                </div>
              )}
            </div>

            {/* Course Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                Preview
              </button>
              <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                Publish Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Test Series Form */}
      {showTestForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Create Test Series</h2>
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Test Series Title</label>
                <input
                  type="text"
                  value={testTitle}
                  onChange={(e) => setTestTitle(e.target.value)}
                  placeholder="e.g., Polity Prelims Test Series"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={testSubject}
                  onChange={(e) => setTestSubject(e.target.value)}
                  placeholder="e.g., Indian Polity"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                <select
                  value={testStage}
                  onChange={(e) => setTestStage(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="prelims">Prelims</option>
                  <option value="mains">Mains</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Tests</label>
                <input
                  type="number"
                  value={testCount}
                  onChange={(e) => setTestCount(e.target.value)}
                  placeholder="e.g., 10"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Question Builder */}
            <div className="border-t border-gray-200 pt-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Add Questions ({testQuestions.length} added)
              </h3>
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Question Text</label>
                  <textarea
                    value={qText}
                    onChange={(e) => setQText(e.target.value)}
                    rows={2}
                    placeholder="Enter the question..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {qOptions.map((opt, i) => (
                    <div key={i}>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Option {String.fromCharCode(65 + i)}
                      </label>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const updated = [...qOptions] as [string, string, string, string];
                          updated[i] = e.target.value;
                          setQOptions(updated);
                        }}
                        placeholder={`Option ${String.fromCharCode(65 + i)}`}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Correct Answer</label>
                    <select
                      value={qCorrect}
                      onChange={(e) => setQCorrect(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value={0}>Option A</option>
                      <option value={1}>Option B</option>
                      <option value={2}>Option C</option>
                      <option value={3}>Option D</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Explanation</label>
                    <input
                      type="text"
                      value={qExplanation}
                      onChange={(e) => setQExplanation(e.target.value)}
                      placeholder="Why is this the correct answer?"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <button
                  onClick={addQuestion}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                >
                  Add Question
                </button>
              </div>

              {/* Added Questions */}
              {testQuestions.length > 0 && (
                <div className="mt-4 space-y-2">
                  {testQuestions.map((q, idx) => (
                    <div
                      key={q.id}
                      className="flex items-start justify-between p-3 bg-white border border-gray-200 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium text-gray-900">Q{idx + 1}.</span> {q.text}
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          Correct: Option {String.fromCharCode(65 + q.correctAnswer)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeQuestion(q.id)}
                        className="ml-3 p-1 text-red-400 hover:text-red-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                Save Draft
              </button>
              <button className="px-5 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                Publish Test Series
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

