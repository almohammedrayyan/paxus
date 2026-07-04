import { useState, useEffect, useCallback } from 'react';
import { mockTestSeries, sampleMockTest } from '@/lib/data';

export default function TestsPage() {
  const [activeTab, setActiveTab] = useState<'series' | 'practice'>('series');

  // Practice test state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [testStarted, setTestStarted] = useState(false);
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(sampleMockTest.duration * 60); // seconds
  const [score, setScore] = useState(0);

  const questions = sampleMockTest.questions;
  const totalQuestions = questions.length;

  // Timer
  useEffect(() => {
    if (!testStarted || testSubmitted) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [testStarted, testSubmitted, timeLeft]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (questionIdx: number, optionIdx: number) => {
    if (testSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionIdx]: optionIdx }));
  };

  const handleFlagToggle = () => {
    setFlaggedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(currentQuestion)) {
        next.delete(currentQuestion);
      } else {
        next.add(currentQuestion);
      }
      return next;
    });
  };

  const handleSubmit = useCallback(() => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correct++;
      }
    });
    setScore(correct);
    setTestSubmitted(true);
  }, [questions, selectedAnswers]);

  const handleRetake = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setFlaggedQuestions(new Set());
    setTestStarted(false);
    setTestSubmitted(false);
    setTimeLeft(sampleMockTest.duration * 60);
    setScore(0);
  };

  const getQuestionStatus = (idx: number) => {
    if (flaggedQuestions.has(idx) && selectedAnswers[idx] !== undefined) return 'flagged-answered';
    if (flaggedQuestions.has(idx)) return 'flagged';
    if (selectedAnswers[idx] !== undefined) return 'answered';
    if (idx === currentQuestion) return 'current';
    return 'not-visited';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tests & Mock Exams</h1>
        <p className="mt-1 text-sm text-gray-500">Prepare with test series from top institutes and practice with mock tests</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-0">
          <button
            onClick={() => setActiveTab('series')}
            className={`relative px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'series'
                ? 'text-indigo-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Test Series
          </button>
          <button
            onClick={() => setActiveTab('practice')}
            className={`relative px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'practice'
                ? 'text-indigo-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Practice Test
          </button>
        </div>
      </div>

      {/* Test Series Tab */}
      {activeTab === 'series' && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {mockTestSeries.map((ts) => (
            <div key={ts.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      ts.stage === 'prelims' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {ts.stage.charAt(0).toUpperCase() + ts.stage.slice(1)}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                      {ts.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{ts.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{ts.provider}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-600 line-clamp-2">{ts.description}</p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-gray-50 p-3 text-center">
                  <p className="text-lg font-bold text-gray-900">{ts.totalTests}</p>
                  <p className="text-xs text-gray-500">Tests</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 text-center">
                  <p className="text-lg font-bold text-gray-900">{ts.totalQuestions.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Questions</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 text-center">
                  <p className="text-lg font-bold text-gray-900">{(ts.attemptedBy / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-gray-500">Attempted</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-yellow-600">{ts.rating}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`h-3.5 w-3.5 ${i < Math.floor(ts.rating) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <span className="text-xl font-bold text-gray-900">&#8377;{ts.price.toLocaleString()}</span>
              </div>
              <button className="mt-4 w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 active:bg-indigo-800">
                Enroll Now
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Practice Test Tab */}
      {activeTab === 'practice' && (
        <div>
          {!testStarted && !testSubmitted && (
            <div className="mx-auto max-w-2xl rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100">
                <svg className="h-10 w-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{sampleMockTest.title}</h2>
              <p className="mt-2 text-gray-500">Full-length mock test simulating the actual UPSC Prelims experience</p>
              <div className="mt-6 flex justify-center gap-8">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{totalQuestions}</p>
                  <p className="text-sm text-gray-500">Questions</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{sampleMockTest.duration} min</p>
                  <p className="text-sm text-gray-500">Duration</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{sampleMockTest.totalMarks}</p>
                  <p className="text-sm text-gray-500">Total Marks</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">-{sampleMockTest.negativeMarking}</p>
                  <p className="text-sm text-gray-500">Negative</p>
                </div>
              </div>
              <button
                onClick={() => setTestStarted(true)}
                className="mt-8 rounded-lg bg-indigo-600 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
              >
                Start Test
              </button>
            </div>
          )}

          {testStarted && !testSubmitted && (
            <div className="flex gap-6">
              {/* Question Area */}
              <div className="flex-1">
                {/* Timer Bar */}
                <div className="mb-4 flex items-center justify-between rounded-lg border border-gray-200 bg-white px-5 py-3 shadow-sm">
                  <h2 className="font-semibold text-gray-900">{sampleMockTest.title}</h2>
                  <div className={`flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-lg font-bold ${
                    timeLeft < 600 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'
                  }`}>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatTime(timeLeft)}
                  </div>
                </div>

                {/* Question Card */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                        {currentQuestion + 1}
                      </span>
                      <span className="text-sm text-gray-500">of {totalQuestions} questions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        questions[currentQuestion].difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                        questions[currentQuestion].difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {questions[currentQuestion].difficulty.charAt(0).toUpperCase() + questions[currentQuestion].difficulty.slice(1)}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                        {questions[currentQuestion].subject}
                      </span>
                    </div>
                  </div>

                  <p className="mb-6 whitespace-pre-line text-gray-800 leading-relaxed">{questions[currentQuestion].text}</p>

                  <div className="space-y-3">
                    {questions[currentQuestion].options.map((option, idx) => (
                      <label
                        key={idx}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-all ${
                          selectedAnswers[currentQuestion] === idx
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q-${currentQuestion}`}
                          checked={selectedAnswers[currentQuestion] === idx}
                          onChange={() => handleSelectAnswer(currentQuestion, idx)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">
                          <span className="mr-2 font-medium text-gray-500">({String.fromCharCode(65 + idx)})</span>
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                    <button
                      onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
                      disabled={currentQuestion === 0}
                      className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </button>
                    <button
                      onClick={handleFlagToggle}
                      className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                        flaggedQuestions.has(currentQuestion)
                          ? 'border-orange-300 bg-orange-50 text-orange-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <svg className="h-4 w-4" fill={flaggedQuestions.has(currentQuestion) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                      </svg>
                      {flaggedQuestions.has(currentQuestion) ? 'Flagged' : 'Flag for Review'}
                    </button>
                    {currentQuestion < totalQuestions - 1 ? (
                      <button
                        onClick={() => setCurrentQuestion((prev) => Math.min(totalQuestions - 1, prev + 1))}
                        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                      >
                        Next
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmit}
                        className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700"
                      >
                        Submit Test
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Question Navigation Panel */}
              <div className="hidden w-72 flex-shrink-0 lg:block">
                <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <h3 className="mb-4 font-semibold text-gray-900">Question Navigator</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {questions.map((_, idx) => {
                      const status = getQuestionStatus(idx);
                      return (
                        <button
                          key={idx}
                          onClick={() => setCurrentQuestion(idx)}
                          className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-all ${
                            status === 'current'
                              ? 'bg-indigo-600 text-white ring-2 ring-indigo-300'
                              : status === 'answered'
                              ? 'bg-green-500 text-white'
                              : status === 'flagged'
                              ? 'bg-orange-400 text-white'
                              : status === 'flagged-answered'
                              ? 'bg-orange-400 text-white ring-2 ring-green-400'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-5 space-y-2 border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded bg-green-500"></div>
                      <span className="text-xs text-gray-600">Answered ({Object.keys(selectedAnswers).length})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded bg-orange-400"></div>
                      <span className="text-xs text-gray-600">Flagged ({flaggedQuestions.size})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded bg-gray-100 border border-gray-300"></div>
                      <span className="text-xs text-gray-600">Not Visited ({totalQuestions - Object.keys(selectedAnswers).length})</span>
                    </div>
                  </div>
                  <button
                    onClick={handleSubmit}
                    className="mt-5 w-full rounded-lg bg-green-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700"
                  >
                    Submit Test
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {testSubmitted && (
            <div className="mx-auto max-w-3xl space-y-6">
              <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
                  <span className="text-2xl font-bold text-white">{score}/{totalQuestions}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Test Completed!</h2>
                <p className="mt-2 text-gray-500">You scored {score} out of {totalQuestions} questions correctly</p>
                <div className="mt-6 flex justify-center gap-8">
                  <div className="rounded-lg bg-green-50 px-6 py-3">
                    <p className="text-2xl font-bold text-green-600">{score}</p>
                    <p className="text-sm text-green-700">Correct</p>
                  </div>
                  <div className="rounded-lg bg-red-50 px-6 py-3">
                    <p className="text-2xl font-bold text-red-600">
                      {Object.keys(selectedAnswers).length - score}
                    </p>
                    <p className="text-sm text-red-700">Incorrect</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 px-6 py-3">
                    <p className="text-2xl font-bold text-gray-600">
                      {totalQuestions - Object.keys(selectedAnswers).length}
                    </p>
                    <p className="text-sm text-gray-700">Unanswered</p>
                  </div>
                </div>
                <button
                  onClick={handleRetake}
                  className="mt-6 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                >
                  Retake Test
                </button>
              </div>

              {/* Answer Review */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Answer Review</h3>
                {questions.map((q, idx) => {
                  const userAnswer = selectedAnswers[idx];
                  const isCorrect = userAnswer === q.correctAnswer;
                  return (
                    <div key={q.id} className={`rounded-xl border p-5 ${isCorrect ? 'border-green-200 bg-green-50' : userAnswer !== undefined ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex items-start gap-3">
                        <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                          isCorrect ? 'bg-green-500' : userAnswer !== undefined ? 'bg-red-500' : 'bg-gray-400'
                        }`}>
                          {idx + 1}
                        </span>
                        <div className="flex-1">
                          <p className="whitespace-pre-line text-sm text-gray-800">{q.text}</p>
                          <div className="mt-3 space-y-1.5">
                            {q.options.map((opt, optIdx) => (
                              <div key={optIdx} className={`rounded px-3 py-1.5 text-sm ${
                                optIdx === q.correctAnswer ? 'bg-green-200 font-medium text-green-900' :
                                optIdx === userAnswer && !isCorrect ? 'bg-red-200 text-red-900 line-through' :
                                'text-gray-600'
                              }`}>
                                ({String.fromCharCode(65 + optIdx)}) {opt}
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
                            <p className="text-xs font-medium text-blue-800">Explanation:</p>
                            <p className="text-xs text-blue-700 mt-0.5">{q.explanation}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

