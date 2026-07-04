import Navbar from './Navbar';
import Sidebar from './Sidebar';
import type { UserRole } from '@/lib/types';

export default function DashboardLayout({ role, children }: { role: UserRole; children: React.ReactNode }) {
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
