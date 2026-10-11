import Navbar from './Navbar';
import Sidebar from './Sidebar';
import type { UserRole } from '@/lib/types';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';

export default function DashboardLayout({ role, children }: { role: UserRole; children: React.ReactNode }) {
  const user = useAppSelector((state) => state.auth.session?.user);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={`/${user.role}`} replace />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar role={role} />
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
