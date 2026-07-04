import type {
  Course, TestSeries, MockTest, StudyResource, Mentor, LiveClass,
  Notification, Review, Transaction, ForumPost, ContentSubmission,
  SupportTicket, StudentProfile, InstituteProfile, EducatorProfile,
  PublisherProfile,
} from './types';

// ===== STUDENT PROFILES =====
export const mockStudents: StudentProfile[] = [
  {
    id: 'stu-1', name: 'Priya Sharma', email: 'priya@email.com', role: 'student',
    phone: '9876543210', city: 'Delhi', language: 'English',
    targetExam: 'UPSC CSE', stage: 'prelims', optionalSubject: 'Sociology',
    enrolledCourses: ['crs-1', 'crs-3'], completedTests: ['tst-1'],
    studyStreak: 45, overallScore: 72, createdAt: '2025-06-15',
  },
  {
    id: 'stu-2', name: 'Rahul Verma', email: 'rahul@email.com', role: 'student',
    phone: '9876543211', city: 'Lucknow', language: 'Hindi',
    targetExam: 'UPSC CSE', stage: 'mains', optionalSubject: 'History',
    enrolledCourses: ['crs-2', 'crs-4'], completedTests: ['tst-1', 'tst-2'],
    studyStreak: 120, overallScore: 81, createdAt: '2025-03-10',
  },
];

// ===== INSTITUTE PROFILES =====
export const mockInstitutes: InstituteProfile[] = [
  {
    id: 'inst-1', name: 'Admin - Vision IAS', email: 'admin@visionias.in', role: 'institute',
    instituteName: 'Vision IAS', description: 'India\'s leading UPSC coaching institute with 15+ years of experience.',
    verified: true, coursesCount: 24, studentsCount: 15420, rating: 4.7,
    address: 'Jia Sarai, New Delhi', city: 'Delhi', language: 'English',
    createdAt: '2024-01-15', phone: '011-40000000',
  },
  {
    id: 'inst-2', name: 'Admin - Vajiram & Ravi', email: 'admin@vajiram.com', role: 'institute',
    instituteName: 'Vajiram & Ravi', description: 'Premier institute for IAS coaching since 1976.',
    verified: true, coursesCount: 18, studentsCount: 12300, rating: 4.6,
    address: 'Old Rajinder Nagar, New Delhi', city: 'Delhi', language: 'English',
    createdAt: '2024-02-20', phone: '011-45000000',
  },
  {
    id: 'inst-3', name: 'Admin - Shankar IAS', email: 'admin@shankaracademy.com', role: 'institute',
    instituteName: 'Shankar IAS Academy', description: 'Leading UPSC coaching in South India.',
    verified: true, coursesCount: 15, studentsCount: 8900, rating: 4.5,
    address: 'T. Nagar, Chennai', city: 'Chennai', language: 'English',
    createdAt: '2024-03-10', phone: '044-28000000',
  },
];

// ===== EDUCATOR PROFILES =====
export const mockEducators: EducatorProfile[] = [
  {
    id: 'edu-1', name: 'Dr. Sidharth Arora', email: 'sidharth@email.com', role: 'educator',
    bio: 'Former IAS officer with 10 years of teaching experience. Specializes in GS Paper II and Essay.',
    specializations: ['Polity', 'Governance', 'Essay'], experience: 10,
    rating: 4.9, studentsCount: 5400, coursesCount: 8, verified: true,
    city: 'Delhi', language: 'English', createdAt: '2024-04-01', phone: '9876500001',
  },
  {
    id: 'edu-2', name: 'Prof. Meera Krishnan', email: 'meera@email.com', role: 'educator',
    bio: 'PhD in History from JNU. Expert in Ancient and Medieval Indian History for UPSC.',
    specializations: ['History', 'Art & Culture'], experience: 12,
    rating: 4.8, studentsCount: 3200, coursesCount: 5, verified: true,
    city: 'Chennai', language: 'English', createdAt: '2024-05-15', phone: '9876500002',
  },
  {
    id: 'edu-3', name: 'Rajesh Kumar Singh', email: 'rajesh@email.com', role: 'educator',
    bio: 'UPSC CSE AIR 45 (2019). Mentoring aspirants for Prelims and Optional Geography.',
    specializations: ['Geography', 'Environment', 'Prelims Strategy'], experience: 5,
    rating: 4.7, studentsCount: 2100, coursesCount: 4, verified: true,
    city: 'Patna', language: 'Hindi', createdAt: '2024-06-01', phone: '9876500003',
  },
];

// ===== PUBLISHER PROFILES =====
export const mockPublishers: PublisherProfile[] = [
  {
    id: 'pub-1', name: 'Admin - TMH UPSC', email: 'admin@tmh.com', role: 'publisher',
    publisherName: 'Tata McGraw Hill', description: 'Leading publisher for competitive exam preparation books.',
    booksCount: 35, verified: true,
    city: 'Mumbai', language: 'English', createdAt: '2024-01-01', phone: '022-40000000',
  },
  {
    id: 'pub-2', name: 'Admin - Orient BlackSwan', email: 'admin@obs.com', role: 'publisher',
    publisherName: 'Orient BlackSwan', description: 'Premier academic publisher with wide range of UPSC resources.',
    booksCount: 28, verified: true,
    city: 'Hyderabad', language: 'English', createdAt: '2024-02-01', phone: '040-30000000',
  },
];

// ===== COURSES =====
export const mockCourses: Course[] = [
  {
    id: 'crs-1', title: 'Complete UPSC Prelims 2026 - GS Foundation',
    description: 'Comprehensive course covering all GS subjects for Prelims with 200+ hours of video lectures, study material, and practice tests.',
    provider: 'Vision IAS', providerType: 'institute', providerId: 'inst-1',
    category: 'Foundation', subjects: ['History', 'Geography', 'Polity', 'Economy', 'Science', 'Environment'],
    stage: 'prelims', language: 'English', price: 24999, originalPrice: 39999,
    rating: 4.7, reviewsCount: 2340, studentsEnrolled: 8920, duration: '12 months',
    lessons: 320, thumbnail: '/courses/prelims-gs.jpg', featured: true,
    tags: ['bestseller', 'prelims', 'foundation'], createdAt: '2025-06-01',
  },
  {
    id: 'crs-2', title: 'GS Mains Answer Writing Mastery',
    description: 'Master the art of answer writing for UPSC Mains. Includes 100+ model answers, peer review, and mentor feedback.',
    provider: 'Dr. Sidharth Arora', providerType: 'educator', providerId: 'edu-1',
    category: 'Answer Writing', subjects: ['GS Paper I', 'GS Paper II', 'GS Paper III', 'GS Paper IV'],
    stage: 'mains', language: 'English', price: 7999, originalPrice: 12999,
    rating: 4.9, reviewsCount: 890, studentsEnrolled: 3450, duration: '6 months',
    lessons: 120, thumbnail: '/courses/mains-writing.jpg', featured: true,
    tags: ['top-rated', 'mains', 'answer-writing'], createdAt: '2025-07-15',
  },
  {
    id: 'crs-3', title: 'Indian Polity & Governance - Complete Course',
    description: 'Deep-dive into Indian Polity covering Constitution, governance, and contemporary issues for UPSC.',
    provider: 'Vajiram & Ravi', providerType: 'institute', providerId: 'inst-2',
    category: 'Subject-wise', subjects: ['Polity', 'Governance'],
    stage: 'all', language: 'English', price: 5999, originalPrice: 8999,
    rating: 4.6, reviewsCount: 1560, studentsEnrolled: 6700, duration: '4 months',
    lessons: 85, thumbnail: '/courses/polity.jpg', featured: false,
    tags: ['polity', 'governance'], createdAt: '2025-05-20',
  },
  {
    id: 'crs-4', title: 'History Optional - Complete Foundation to Advanced',
    description: 'Comprehensive History Optional course from Ancient to Modern India with map work and answer writing practice.',
    provider: 'Prof. Meera Krishnan', providerType: 'educator', providerId: 'edu-2',
    category: 'Optional', subjects: ['Ancient History', 'Medieval History', 'Modern History', 'World History'],
    stage: 'mains', language: 'English', price: 15999, originalPrice: 22999,
    rating: 4.8, reviewsCount: 670, studentsEnrolled: 2100, duration: '8 months',
    lessons: 180, thumbnail: '/courses/history-opt.jpg', featured: true,
    tags: ['optional', 'history', 'comprehensive'], createdAt: '2025-04-10',
  },
  {
    id: 'crs-5', title: 'Geography Optional Crash Course',
    description: 'Focused crash course for Geography Optional covering all important topics with PYQ analysis.',
    provider: 'Rajesh Kumar Singh', providerType: 'educator', providerId: 'edu-3',
    category: 'Optional', subjects: ['Physical Geography', 'Human Geography', 'Indian Geography'],
    stage: 'mains', language: 'Hindi', price: 8999, originalPrice: 14999,
    rating: 4.7, reviewsCount: 430, studentsEnrolled: 1800, duration: '5 months',
    lessons: 100, thumbnail: '/courses/geo-opt.jpg', featured: false,
    tags: ['optional', 'geography', 'crash-course'], createdAt: '2025-08-01',
  },
  {
    id: 'crs-6', title: 'CSAT Paper II - Aptitude & Reasoning',
    description: 'Complete CSAT preparation with tricks, shortcuts, and extensive practice for Paper II.',
    provider: 'Shankar IAS Academy', providerType: 'institute', providerId: 'inst-3',
    category: 'CSAT', subjects: ['Aptitude', 'Reasoning', 'Comprehension', 'Decision Making'],
    stage: 'prelims', language: 'English', price: 3999, originalPrice: 6999,
    rating: 4.5, reviewsCount: 980, studentsEnrolled: 4500, duration: '3 months',
    lessons: 60, thumbnail: '/courses/csat.jpg', featured: false,
    tags: ['csat', 'prelims', 'aptitude'], createdAt: '2025-09-01',
  },
  {
    id: 'crs-7', title: 'Economy for UPSC - Beginner to Advanced',
    description: 'Learn Indian Economy from basics to advanced concepts. Covers budget, banking, international trade and more.',
    provider: 'Vision IAS', providerType: 'institute', providerId: 'inst-1',
    category: 'Subject-wise', subjects: ['Economy', 'Economic Survey', 'Budget'],
    stage: 'all', language: 'English', price: 6999, originalPrice: 9999,
    rating: 4.6, reviewsCount: 1120, studentsEnrolled: 5300, duration: '4 months',
    lessons: 90, thumbnail: '/courses/economy.jpg', featured: true,
    tags: ['economy', 'foundation'], createdAt: '2025-07-01',
  },
  {
    id: 'crs-8', title: 'Ethics, Integrity & Aptitude (GS Paper IV)',
    description: 'Comprehensive course on Ethics for UPSC Mains Paper IV with case studies and thinkers.',
    provider: 'Dr. Sidharth Arora', providerType: 'educator', providerId: 'edu-1',
    category: 'Subject-wise', subjects: ['Ethics', 'Integrity', 'Aptitude'],
    stage: 'mains', language: 'English', price: 4999, originalPrice: 7999,
    rating: 4.8, reviewsCount: 540, studentsEnrolled: 2800, duration: '3 months',
    lessons: 55, thumbnail: '/courses/ethics.jpg', featured: false,
    tags: ['ethics', 'mains', 'gs4'], createdAt: '2025-08-15',
  },
];

// ===== TEST SERIES =====
export const mockTestSeries: TestSeries[] = [
  {
    id: 'ts-1', title: 'Vision IAS Prelims Test Series 2026',
    description: 'India\'s most attempted UPSC Prelims test series with detailed solutions and all-India ranking.',
    provider: 'Vision IAS', providerId: 'inst-1', category: 'Prelims',
    stage: 'prelims', totalTests: 35, totalQuestions: 3500,
    duration: '2 hours per test', price: 4999, rating: 4.8, attemptedBy: 45000,
    language: 'English', subjects: ['GS', 'CSAT'],
  },
  {
    id: 'ts-2', title: 'Vajiram Mains GS Test Series',
    description: 'Comprehensive Mains GS test series covering all 4 GS papers with model answers and evaluation.',
    provider: 'Vajiram & Ravi', providerId: 'inst-2', category: 'Mains',
    stage: 'mains', totalTests: 28, totalQuestions: 420,
    duration: '3 hours per test', price: 6999, rating: 4.7, attemptedBy: 22000,
    language: 'English', subjects: ['GS I', 'GS II', 'GS III', 'GS IV'],
  },
  {
    id: 'ts-3', title: 'Prelims Current Affairs Monthly Tests',
    description: 'Monthly current affairs tests for Prelims with detailed explanations from daily news analysis.',
    provider: 'Shankar IAS Academy', providerId: 'inst-3', category: 'Current Affairs',
    stage: 'prelims', totalTests: 12, totalQuestions: 1200,
    duration: '1 hour per test', price: 1999, rating: 4.5, attemptedBy: 18000,
    language: 'English', subjects: ['Current Affairs'],
  },
  {
    id: 'ts-4', title: 'History Optional Test Series',
    description: 'Complete test series for History Optional with answer evaluation by experts.',
    provider: 'Prof. Meera Krishnan', providerId: 'edu-2', category: 'Optional',
    stage: 'mains', totalTests: 16, totalQuestions: 160,
    duration: '3 hours per test', price: 3999, rating: 4.8, attemptedBy: 3200,
    language: 'English', subjects: ['History Optional'],
  },
];

// ===== MOCK TEST QUESTIONS =====
export const sampleMockTest: MockTest = {
  id: 'mt-1', seriesId: 'ts-1', title: 'Full Length Test 1 - Prelims GS',
  duration: 120, totalMarks: 200, negativeMarking: 0.33,
  questions: [
    {
      id: 'q-1', text: 'Which of the following is/are the feature(s) of the Government of India Act, 1935?\n1. Establishment of All India Federation\n2. Provincial Autonomy\n3. Bicameral Legislature at Centre\nSelect the correct answer:',
      options: ['1 and 2 only', '2 and 3 only', '1 and 3 only', 'All of the above'],
      correctAnswer: 3, explanation: 'The Government of India Act, 1935 provided for: (1) Establishment of All India Federation, (2) Provincial Autonomy, (3) Bicameral Legislature at the Centre with Federal Assembly and Council of States.',
      subject: 'Polity', difficulty: 'medium',
    },
    {
      id: 'q-2', text: 'The Coriolis force is maximum at:',
      options: ['The Equator', 'The Tropics', '45° latitude', 'The Poles'],
      correctAnswer: 3, explanation: 'The Coriolis force is zero at the Equator and maximum at the Poles. It increases with latitude.',
      subject: 'Geography', difficulty: 'easy',
    },
    {
      id: 'q-3', text: 'Which of the following committees recommended the creation of Lokpal and Lokayukta?\n1. First Administrative Reforms Commission\n2. Santhanam Committee\n3. Shah Commission\nSelect the correct answer:',
      options: ['1 only', '1 and 2 only', '2 and 3 only', 'All of the above'],
      correctAnswer: 1, explanation: 'The First ARC (Morarji Desai Commission, 1966) recommended the creation of Lokpal at Centre and Lokayukta in states. The Santhanam Committee (1964) dealt with prevention of corruption but did not specifically recommend Lokpal.',
      subject: 'Polity', difficulty: 'hard',
    },
    {
      id: 'q-4', text: 'Consider the following statements about the Indus Valley Civilization:\n1. The Great Bath was found at Mohenjo-daro\n2. The Granary was found at Harappa\n3. Evidence of horse was found at Surkotada\nWhich of the above is/are correct?',
      options: ['1 and 2 only', '2 and 3 only', '1 and 3 only', 'All of the above'],
      correctAnswer: 3, explanation: 'All three statements are correct. The Great Bath is at Mohenjo-daro, the Granary at Harappa, and horse evidence (bones) at Surkotada (Gujarat).',
      subject: 'History', difficulty: 'medium',
    },
    {
      id: 'q-5', text: 'The term "Core Sector Industries" in India includes which of the following?\n1. Coal\n2. Crude Oil\n3. Cement\n4. Fertilizers\n5. Textiles\nSelect the correct answer:',
      options: ['1, 2, and 3 only', '1, 2, 3, and 4 only', '1, 2, 3, 4, and 5', '1, 3, and 5 only'],
      correctAnswer: 1, explanation: 'The eight core sector industries are: Coal, Crude Oil, Natural Gas, Refinery Products, Fertilizers, Steel, Cement, and Electricity. Textiles is not a core sector industry.',
      subject: 'Economy', difficulty: 'medium',
    },
  ],
};

// ===== STUDY RESOURCES =====
export const mockResources: StudyResource[] = [
  {
    id: 'res-1', title: 'Indian Polity by M. Laxmikanth - Summary Notes',
    type: 'pdf', subject: 'Polity', provider: 'Vision IAS', providerId: 'inst-1',
    price: 0, free: true, language: 'English',
    description: 'Concise summary notes of Laxmikanth covering all important chapters for Prelims and Mains.',
    pages: 120, fileSize: '15 MB',
  },
  {
    id: 'res-2', title: 'Geography of India - NCERT Compiled Notes',
    type: 'pdf', subject: 'Geography', provider: 'Shankar IAS Academy', providerId: 'inst-3',
    price: 199, free: false, language: 'English',
    description: 'Compiled notes from NCERT Geography textbooks (Class 6-12) organized topic-wise for UPSC.',
    pages: 200, fileSize: '25 MB',
  },
  {
    id: 'res-3', title: 'Yojana Magazine - January 2026',
    type: 'magazine', subject: 'Current Affairs', provider: 'Tata McGraw Hill', providerId: 'pub-1',
    price: 99, free: false, language: 'English',
    description: 'Monthly Yojana magazine covering government schemes and policy matters.',
    pages: 60, fileSize: '8 MB',
  },
  {
    id: 'res-4', title: 'Environment & Ecology Complete Notes',
    type: 'notes', subject: 'Environment', provider: 'Rajesh Kumar Singh', providerId: 'edu-3',
    price: 499, free: false, language: 'Hindi',
    description: 'Comprehensive notes on Environment and Ecology covering Shankar IAS and Shankar environment book.',
    pages: 180, fileSize: '20 MB',
  },
  {
    id: 'res-5', title: 'Ancient India - Video Lectures Series',
    type: 'video', subject: 'History', provider: 'Prof. Meera Krishnan', providerId: 'edu-2',
    price: 1999, free: false, language: 'English',
    description: '40+ video lectures covering Ancient Indian History for UPSC Mains and Optional.',
  },
  {
    id: 'res-6', title: 'Daily Current Affairs Compilation - Dec 2025',
    type: 'pdf', subject: 'Current Affairs', provider: 'Vision IAS', providerId: 'inst-1',
    price: 0, free: true, language: 'English',
    description: 'Daily current affairs compilation for December 2025 covering all important news.',
    pages: 90, fileSize: '12 MB',
  },
  {
    id: 'res-7', title: 'Ethics Case Studies Compilation',
    type: 'ebook', subject: 'Ethics', provider: 'Orient BlackSwan', providerId: 'pub-2',
    price: 299, free: false, language: 'English',
    description: 'Collection of 100+ ethics case studies with model answers for GS Paper IV.',
    pages: 150, fileSize: '10 MB',
  },
  {
    id: 'res-8', title: 'Economic Survey 2025-26 Analysis',
    type: 'pdf', subject: 'Economy', provider: 'Vajiram & Ravi', providerId: 'inst-2',
    price: 0, free: true, language: 'English',
    description: 'Chapter-wise analysis of Economic Survey with key takeaways for UPSC.',
    pages: 75, fileSize: '10 MB',
  },
];

// ===== MENTORS =====
export const mockMentors: Mentor[] = [
  {
    id: 'mnt-1', name: 'Arun Sharma (IAS 2018, AIR 32)',
    avatar: '/mentors/arun.jpg', specialization: ['Prelims Strategy', 'Mains GS', 'Interview'],
    experience: 6, rating: 4.9, sessionsCompleted: 450, pricePerSession: 1500,
    availability: ['Mon', 'Wed', 'Fri', 'Sat'],
    bio: 'Serving IAS officer. Cleared UPSC in first attempt. Passionate about guiding aspirants.',
    languages: ['English', 'Hindi'],
  },
  {
    id: 'mnt-2', name: 'Kavitha Reddy (IPS 2019, AIR 67)',
    avatar: '/mentors/kavitha.jpg', specialization: ['Optional Sociology', 'Essay', 'Interview'],
    experience: 5, rating: 4.8, sessionsCompleted: 320, pricePerSession: 1200,
    availability: ['Tue', 'Thu', 'Sat', 'Sun'],
    bio: 'IPS officer who cracked UPSC with Sociology Optional. Specializes in essay and answer writing.',
    languages: ['English', 'Telugu', 'Hindi'],
  },
  {
    id: 'mnt-3', name: 'Dr. Vikash Mishra (IAS 2016, AIR 15)',
    avatar: '/mentors/vikash.jpg', specialization: ['Complete Guidance', 'Mains Strategy', 'Prelims'],
    experience: 8, rating: 4.9, sessionsCompleted: 680, pricePerSession: 2000,
    availability: ['Wed', 'Sat', 'Sun'],
    bio: 'Top ranker who now mentors aspirants full-time. Expert in holistic UPSC preparation strategy.',
    languages: ['English', 'Hindi'],
  },
  {
    id: 'mnt-4', name: 'Sneha Patil (IFS 2020, AIR 89)',
    avatar: '/mentors/sneha.jpg', specialization: ['Geography Optional', 'Environment', 'Prelims'],
    experience: 4, rating: 4.7, sessionsCompleted: 210, pricePerSession: 999,
    availability: ['Mon', 'Tue', 'Thu', 'Fri'],
    bio: 'IFS officer who cleared with Geography Optional. Loves helping aspirants with map-based preparation.',
    languages: ['English', 'Hindi', 'Marathi'],
  },
];

// ===== LIVE CLASSES =====
export const mockLiveClasses: LiveClass[] = [
  {
    id: 'lc-1', title: 'Current Affairs Weekly Analysis - Week 5, Feb 2026',
    educator: 'Dr. Sidharth Arora', educatorId: 'edu-1', subject: 'Current Affairs',
    scheduledAt: '2026-02-08T18:00:00', duration: 90, enrolledCount: 340, maxCapacity: 500,
    status: 'upcoming',
  },
  {
    id: 'lc-2', title: 'Prelims 2026 - Geography Map-based Questions',
    educator: 'Rajesh Kumar Singh', educatorId: 'edu-3', subject: 'Geography',
    scheduledAt: '2026-02-09T10:00:00', duration: 120, enrolledCount: 220, maxCapacity: 300,
    status: 'upcoming',
  },
  {
    id: 'lc-3', title: 'Ancient India - Mauryan Empire Deep Dive',
    educator: 'Prof. Meera Krishnan', educatorId: 'edu-2', subject: 'History',
    scheduledAt: '2026-02-08T14:00:00', duration: 90, enrolledCount: 180, maxCapacity: 200,
    status: 'live',
  },
  {
    id: 'lc-4', title: 'Ethics Case Study Practice Session',
    educator: 'Dr. Sidharth Arora', educatorId: 'edu-1', subject: 'Ethics',
    scheduledAt: '2026-02-07T16:00:00', duration: 60, enrolledCount: 250, maxCapacity: 250,
    status: 'completed', recordingUrl: '/recordings/ethics-case-study.mp4',
  },
];

// ===== NOTIFICATIONS =====
export const mockNotifications: Notification[] = [
  {
    id: 'notif-1', title: 'UPSC CSE 2026 Notification Released',
    message: 'UPSC has released the official notification for Civil Services Examination 2026. Last date to apply: March 15, 2026.',
    type: 'exam', date: '2026-02-05', read: false, link: '/student/notifications',
  },
  {
    id: 'notif-2', title: 'New Course: Economy Crash Course',
    message: 'Vision IAS has launched a new Economy crash course specifically designed for Prelims 2026.',
    type: 'course', date: '2026-02-04', read: false, link: '/student/courses',
  },
  {
    id: 'notif-3', title: 'Mock Test Results Available',
    message: 'Your results for Full Length Test 1 are now available. Check your performance analytics.',
    type: 'test', date: '2026-02-03', read: true, link: '/student/tests',
  },
  {
    id: 'notif-4', title: 'Prelims 2026 - Application Deadline Reminder',
    message: 'Reminder: Last date to submit UPSC CSE 2026 application is March 15, 2026.',
    type: 'deadline', date: '2026-02-01', read: true,
  },
  {
    id: 'notif-5', title: 'Live Class Today: Current Affairs Weekly',
    message: 'Dr. Sidharth Arora\'s Current Affairs Weekly Analysis starts at 6:00 PM today.',
    type: 'general', date: '2026-02-08', read: false, link: '/student/courses',
  },
];

// ===== REVIEWS =====
export const mockReviews: Review[] = [
  { id: 'rev-1', userId: 'stu-1', userName: 'Priya Sharma', rating: 5, comment: 'Excellent course! Dr. Arora explains concepts with great clarity. The answer writing practice improved my scores significantly.', date: '2026-01-20', courseId: 'crs-2' },
  { id: 'rev-2', userId: 'stu-2', userName: 'Rahul Verma', rating: 4, comment: 'Very comprehensive coverage of Polity. Some sections could be more concise, but overall a solid course.', date: '2026-01-15', courseId: 'crs-3' },
  { id: 'rev-3', userId: 'stu-1', userName: 'Priya Sharma', rating: 5, comment: 'Best test series available. Questions are very close to actual UPSC level. All-India ranking is motivating.', date: '2026-01-10', testSeriesId: 'ts-1' },
  { id: 'rev-4', userId: 'stu-2', userName: 'Rahul Verma', rating: 5, comment: 'Prof. Meera is an outstanding teacher. Her History Optional course is a game-changer.', date: '2025-12-25', courseId: 'crs-4' },
];

// ===== TRANSACTIONS =====
export const mockTransactions: Transaction[] = [
  { id: 'txn-1', userId: 'stu-1', type: 'course_purchase', amount: 24999, status: 'completed', date: '2026-01-15', description: 'Complete UPSC Prelims 2026 - GS Foundation', providerId: 'inst-1', providerShare: 21249, platformShare: 3750 },
  { id: 'txn-2', userId: 'stu-1', type: 'course_purchase', amount: 5999, status: 'completed', date: '2026-01-20', description: 'Indian Polity & Governance', providerId: 'inst-2', providerShare: 5099, platformShare: 900 },
  { id: 'txn-3', userId: 'stu-2', type: 'course_purchase', amount: 7999, status: 'completed', date: '2026-01-18', description: 'GS Mains Answer Writing Mastery', providerId: 'edu-1', providerShare: 6399, platformShare: 1600 },
  { id: 'txn-4', userId: 'stu-2', type: 'test_purchase', amount: 4999, status: 'completed', date: '2026-01-22', description: 'Vision IAS Prelims Test Series 2026', providerId: 'inst-1', providerShare: 4249, platformShare: 750 },
  { id: 'txn-5', userId: 'stu-1', type: 'mentor_session', amount: 1500, status: 'completed', date: '2026-02-01', description: 'Mentorship Session - Arun Sharma', providerId: 'mnt-1', providerShare: 1200, platformShare: 300 },
  { id: 'txn-6', userId: 'stu-2', type: 'course_purchase', amount: 15999, status: 'completed', date: '2026-01-25', description: 'History Optional - Complete Course', providerId: 'edu-2', providerShare: 12799, platformShare: 3200 },
  { id: 'txn-7', userId: 'stu-1', type: 'resource_purchase', amount: 299, status: 'completed', date: '2026-02-03', description: 'Ethics Case Studies Compilation', providerId: 'pub-2', providerShare: 239, platformShare: 60 },
  { id: 'txn-8', userId: 'stu-2', type: 'subscription', amount: 999, status: 'completed', date: '2026-02-05', description: 'Premium Monthly Subscription', providerId: 'platform', providerShare: 0, platformShare: 999 },
];

// ===== FORUM POSTS =====
export const mockForumPosts: ForumPost[] = [
  { id: 'fp-1', title: 'How to prepare for Ethics Paper in 3 months?', content: 'I have 3 months left for Mains and I haven\'t started Ethics preparation yet. Can someone guide me on the best strategy?', author: 'Priya Sharma', authorId: 'stu-1', category: 'Strategy', replies: 24, likes: 45, date: '2026-02-07', tags: ['ethics', 'mains', 'strategy'] },
  { id: 'fp-2', title: 'Best books for Economy - Prelims 2026', content: 'What are the must-read books for Economy section in Prelims? I\'m confused between multiple options.', author: 'Rahul Verma', authorId: 'stu-2', category: 'Resources', replies: 31, likes: 67, date: '2026-02-06', tags: ['economy', 'prelims', 'books'] },
  { id: 'fp-3', title: 'Geography Optional - Map work strategy', content: 'Sharing my strategy for preparing map-based questions for Geography Optional. This helped me score 310+ in optional.', author: 'Sneha Patil', authorId: 'mnt-4', category: 'Optional', replies: 18, likes: 89, date: '2026-02-05', tags: ['geography', 'optional', 'strategy'] },
  { id: 'fp-4', title: 'Current Affairs: Union Budget 2026 Key Highlights', content: 'Important highlights from Union Budget 2026-27 relevant for UPSC aspirants. Compiled from multiple sources.', author: 'Dr. Sidharth Arora', authorId: 'edu-1', category: 'Current Affairs', replies: 42, likes: 156, date: '2026-02-03', tags: ['current-affairs', 'economy', 'budget'] },
  { id: 'fp-5', title: 'Topper Interview: AIR 23 shares preparation journey', content: 'Detailed interview with last year\'s AIR 23 sharing their complete preparation journey, booklist, and daily schedule.', author: 'Admin', authorId: 'admin-1', category: 'Motivation', replies: 56, likes: 234, date: '2026-02-01', tags: ['topper', 'interview', 'motivation'] },
];

// ===== CONTENT SUBMISSIONS (for Admin) =====
export const mockSubmissions: ContentSubmission[] = [
  { id: 'sub-1', title: 'Advanced CSAT Course', type: 'course', submittedBy: 'Shankar IAS Academy', submitterId: 'inst-3', submitterType: 'institute', status: 'pending', submittedAt: '2026-02-07' },
  { id: 'sub-2', title: 'Modern India Test Series', type: 'test_series', submittedBy: 'Prof. Meera Krishnan', submitterId: 'edu-2', submitterType: 'educator', status: 'pending', submittedAt: '2026-02-06' },
  { id: 'sub-3', title: 'Art & Culture Quick Revision Notes', type: 'resource', submittedBy: 'Orient BlackSwan', submitterId: 'pub-2', submitterType: 'publisher', status: 'pending', submittedAt: '2026-02-05' },
  { id: 'sub-4', title: 'Sociology Optional Crash Course', type: 'course', submittedBy: 'Dr. Sidharth Arora', submitterId: 'edu-1', submitterType: 'educator', status: 'approved', submittedAt: '2026-02-01', reviewedAt: '2026-02-03', reviewNotes: 'High quality content. Approved.' },
  { id: 'sub-5', title: 'Science & Tech Yearbook 2026', type: 'resource', submittedBy: 'Tata McGraw Hill', submitterId: 'pub-1', submitterType: 'publisher', status: 'rejected', submittedAt: '2026-01-28', reviewedAt: '2026-02-01', reviewNotes: 'Content quality does not meet platform standards. Please revise.' },
];

// ===== SUPPORT TICKETS =====
export const mockTickets: SupportTicket[] = [
  { id: 'tkt-1', subject: 'Payment failed but amount deducted', description: 'I tried purchasing the Prelims test series but payment failed. Amount of Rs. 4999 has been deducted from my account.', raisedBy: 'Priya Sharma', raisedById: 'stu-1', category: 'payment', status: 'open', priority: 'high', createdAt: '2026-02-07', updatedAt: '2026-02-07' },
  { id: 'tkt-2', subject: 'Video lectures not loading', description: 'The video lectures for History Optional course are buffering continuously and not playing.', raisedBy: 'Rahul Verma', raisedById: 'stu-2', category: 'technical', status: 'in_progress', priority: 'medium', createdAt: '2026-02-06', updatedAt: '2026-02-07' },
  { id: 'tkt-3', subject: 'Incorrect question in mock test', description: 'Question 45 in FLT-3 has an incorrect answer key. The correct answer should be option C, not B.', raisedBy: 'Priya Sharma', raisedById: 'stu-1', category: 'content', status: 'resolved', priority: 'low', createdAt: '2026-02-03', updatedAt: '2026-02-05' },
  { id: 'tkt-4', subject: 'Revenue not credited for January', description: 'My January revenue of Rs. 45,000 has not been credited to my bank account yet.', raisedBy: 'Dr. Sidharth Arora', raisedById: 'edu-1', category: 'payment', status: 'open', priority: 'high', createdAt: '2026-02-05', updatedAt: '2026-02-05' },
  { id: 'tkt-5', subject: 'Student disputing course refund', description: 'A student is requesting a refund for my course after accessing 80% of the content citing quality issues.', raisedBy: 'Vision IAS', raisedById: 'inst-1', category: 'dispute', status: 'in_progress', priority: 'medium', createdAt: '2026-02-04', updatedAt: '2026-02-06' },
];

// ===== ANALYTICS DATA =====
export const platformAnalytics = {
  totalUsers: 125000,
  totalStudents: 118500,
  totalInstitutes: 45,
  totalEducators: 320,
  totalPublishers: 18,
  totalCourses: 580,
  totalTestSeries: 120,
  totalRevenue: 45600000,
  monthlyActiveUsers: 67000,
  averageRating: 4.6,
  topSubjects: [
    { subject: 'Polity', searches: 45000 },
    { subject: 'History', searches: 38000 },
    { subject: 'Geography', searches: 35000 },
    { subject: 'Economy', searches: 32000 },
    { subject: 'Current Affairs', searches: 28000 },
    { subject: 'Ethics', searches: 20000 },
  ],
  monthlyRevenue: [
    { month: 'Sep 2025', revenue: 3200000 },
    { month: 'Oct 2025', revenue: 3800000 },
    { month: 'Nov 2025', revenue: 4100000 },
    { month: 'Dec 2025', revenue: 4500000 },
    { month: 'Jan 2026', revenue: 5200000 },
    { month: 'Feb 2026', revenue: 4800000 },
  ],
  cityWiseUsers: [
    { city: 'Delhi', users: 32000 },
    { city: 'Lucknow', users: 12000 },
    { city: 'Patna', users: 10500 },
    { city: 'Jaipur', users: 9800 },
    { city: 'Hyderabad', users: 8500 },
    { city: 'Chennai', users: 7200 },
    { city: 'Bengaluru', users: 6800 },
    { city: 'Mumbai', users: 5400 },
  ],
};
