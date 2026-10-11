import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthSessionGuard from '@/components/AuthSessionGuard';

// Public pages
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';

// Student pages
import StudentDashboard from '@/pages/student/Dashboard';
import StudentCourses from '@/pages/student/Courses';
import StudentTests from '@/pages/student/Tests';
import StudentResources from '@/pages/student/Resources';
import StudentMentorship from '@/pages/student/Mentorship';
import StudentCommunity from '@/pages/student/Community';
import StudentNotifications from '@/pages/student/Notifications';

// Admin pages
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminModeration from '@/pages/admin/Moderation';
import AdminRevenue from '@/pages/admin/Revenue';
import AdminSupport from '@/pages/admin/Support';
import AdminUsers from '@/pages/admin/Users';

// Educator pages
import EducatorDashboard from '@/pages/educator/Dashboard';
import EducatorCourses from '@/pages/educator/Courses';
import EducatorRevenue from '@/pages/educator/Revenue';
import EducatorSessions from '@/pages/educator/Sessions';

// Institute pages
import InstituteDashboard from '@/pages/institute/Dashboard';
import InstituteCourses from '@/pages/institute/Courses';
import InstituteAnalytics from '@/pages/institute/Analytics';
import InstituteClasses from '@/pages/institute/Classes';
import InstitutePayments from '@/pages/institute/Payments';

// Publisher pages
import PublisherDashboard from '@/pages/publisher/Dashboard';
import PublisherCatalog from '@/pages/publisher/Catalog';
import PublisherInsights from '@/pages/publisher/Insights';

// Layout
import DashboardLayout from '@/components/DashboardLayout';

function App() {
  return (
    <BrowserRouter>
      <AuthSessionGuard />
      <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Student */}
          <Route path="/student" element={<DashboardLayout role="student"><StudentDashboard /></DashboardLayout>} />
          <Route path="/student/courses" element={<DashboardLayout role="student"><StudentCourses /></DashboardLayout>} />
          <Route path="/student/tests" element={<DashboardLayout role="student"><StudentTests /></DashboardLayout>} />
          <Route path="/student/resources" element={<DashboardLayout role="student"><StudentResources /></DashboardLayout>} />
          <Route path="/student/mentorship" element={<DashboardLayout role="student"><StudentMentorship /></DashboardLayout>} />
          <Route path="/student/community" element={<DashboardLayout role="student"><StudentCommunity /></DashboardLayout>} />
          <Route path="/student/notifications" element={<DashboardLayout role="student"><StudentNotifications /></DashboardLayout>} />

          {/* Admin */}
          <Route path="/admin" element={<DashboardLayout role="admin"><AdminDashboard /></DashboardLayout>} />
          <Route path="/admin/moderation" element={<DashboardLayout role="admin"><AdminModeration /></DashboardLayout>} />
          <Route path="/admin/revenue" element={<DashboardLayout role="admin"><AdminRevenue /></DashboardLayout>} />
          <Route path="/admin/support" element={<DashboardLayout role="admin"><AdminSupport /></DashboardLayout>} />
          <Route path="/admin/users" element={<DashboardLayout role="admin"><AdminUsers /></DashboardLayout>} />

          {/* Educator */}
          <Route path="/educator" element={<DashboardLayout role="educator"><EducatorDashboard /></DashboardLayout>} />
          <Route path="/educator/courses" element={<DashboardLayout role="educator"><EducatorCourses /></DashboardLayout>} />
          <Route path="/educator/revenue" element={<DashboardLayout role="educator"><EducatorRevenue /></DashboardLayout>} />
          <Route path="/educator/sessions" element={<DashboardLayout role="educator"><EducatorSessions /></DashboardLayout>} />

          {/* Institute */}
          <Route path="/institute" element={<DashboardLayout role="institute"><InstituteDashboard /></DashboardLayout>} />
          <Route path="/institute/courses" element={<DashboardLayout role="institute"><InstituteCourses /></DashboardLayout>} />
          <Route path="/institute/analytics" element={<DashboardLayout role="institute"><InstituteAnalytics /></DashboardLayout>} />
          <Route path="/institute/classes" element={<DashboardLayout role="institute"><InstituteClasses /></DashboardLayout>} />
          <Route path="/institute/payments" element={<DashboardLayout role="institute"><InstitutePayments /></DashboardLayout>} />

          {/* Publisher */}
          <Route path="/publisher" element={<DashboardLayout role="publisher"><PublisherDashboard /></DashboardLayout>} />
          <Route path="/publisher/catalog" element={<DashboardLayout role="publisher"><PublisherCatalog /></DashboardLayout>} />
          <Route path="/publisher/insights" element={<DashboardLayout role="publisher"><PublisherInsights /></DashboardLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
