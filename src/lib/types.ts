export type UserRole = 'student' | 'institute' | 'educator' | 'publisher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  city?: string;
  language?: string;
  createdAt: string;
}

export interface StudentProfile extends User {
  role: 'student';
  targetExam: string;
  stage: 'prelims' | 'mains' | 'interview' | 'all';
  optionalSubject?: string;
  enrolledCourses: string[];
  completedTests: string[];
  studyStreak: number;
  overallScore: number;
}

export interface InstituteProfile extends User {
  role: 'institute';
  instituteName: string;
  description: string;
  verified: boolean;
  coursesCount: number;
  studentsCount: number;
  rating: number;
  address: string;
}

export interface EducatorProfile extends User {
  role: 'educator';
  bio: string;
  specializations: string[];
  experience: number;
  rating: number;
  studentsCount: number;
  coursesCount: number;
  verified: boolean;
}

export interface PublisherProfile extends User {
  role: 'publisher';
  publisherName: string;
  description: string;
  booksCount: number;
  verified: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  provider: string;
  providerType: 'institute' | 'educator';
  providerId: string;
  category: string;
  subjects: string[];
  stage: 'prelims' | 'mains' | 'interview' | 'all';
  language: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  studentsEnrolled: number;
  totalRevenue?: number;
  duration: string;
  lessons: number;
  thumbnail: string;
  featured: boolean;
  tags: string[];
  createdAt: string;
}

export interface TestSeries {
  id: string;
  title: string;
  description: string;
  provider: string;
  providerId: string;
  category: string;
  stage: 'prelims' | 'mains';
  totalTests: number;
  totalQuestions: number;
  duration: string;
  price: number;
  rating: number;
  attemptedBy: number;
  language: string;
  subjects: string[];
}

export interface MockTest {
  id: string;
  seriesId: string;
  title: string;
  questions: Question[];
  duration: number; // in minutes
  totalMarks: number;
  negativeMarking: number;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface StudyResource {
  id: string;
  title: string;
  type: 'pdf' | 'ebook' | 'magazine' | 'notes' | 'video';
  subject: string;
  provider: string;
  providerId: string;
  downloadUrl?: string;
  price: number;
  free: boolean;
  language: string;
  description: string;
  pages?: number;
  fileSize?: string;
}

export interface Mentor {
  id: string;
  name: string;
  avatar: string;
  specialization: string[];
  experience: number;
  rating: number;
  sessionsCompleted: number;
  pricePerSession: number;
  availability: string[];
  bio: string;
  languages: string[];
}

export interface LiveClass {
  id: string;
  title: string;
  educator: string;
  educatorId: string;
  subject: string;
  scheduledAt: string;
  duration: number;
  enrolledCount: number;
  maxCapacity: number;
  status: 'upcoming' | 'live' | 'completed';
  recordingUrl?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'exam' | 'course' | 'test' | 'general' | 'deadline';
  date: string;
  read: boolean;
  link?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  courseId?: string;
  testSeriesId?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'course_purchase' | 'test_purchase' | 'subscription' | 'mentor_session' | 'resource_purchase';
  amount: number;
  status: 'completed' | 'pending' | 'refunded';
  date: string;
  description: string;
  providerId: string;
  providerShare: number;
  platformShare: number;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  category: string;
  replies: number;
  likes: number;
  date: string;
  tags: string[];
}

export interface ContentSubmission {
  id: string;
  title: string;
  type: 'course' | 'test_series' | 'resource';
  submittedBy: string;
  submitterId: string;
  submitterType: 'institute' | 'educator' | 'publisher';
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  raisedBy: string;
  raisedById: string;
  category: 'payment' | 'content' | 'technical' | 'dispute' | 'other';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  updatedAt: string;
}
