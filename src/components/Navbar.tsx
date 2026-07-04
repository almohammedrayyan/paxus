import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/context';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const getDashboardLink = () => {
    if (!user) return '/login';
    return `/${user.role}`;
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PA</span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-xl font-bold text-gray-900">PAxus</span>
                <span className="text-xs text-gray-500">Nexus with your success</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-indigo-600 text-sm font-medium">Home</Link>
            <Link to="/student/courses" className="text-gray-600 hover:text-indigo-600 text-sm font-medium">Courses</Link>
            <Link to="/student/tests" className="text-gray-600 hover:text-indigo-600 text-sm font-medium">Test Series</Link>
            <Link to="/student/resources" className="text-gray-600 hover:text-indigo-600 text-sm font-medium">Resources</Link>
            <Link to="/student/mentorship" className="text-gray-600 hover:text-indigo-600 text-sm font-medium">Mentors</Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to={getDashboardLink()} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">Dashboard</Link>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 text-sm font-medium">{user?.name?.charAt(0)}</span>
                  </div>
                  <span className="text-sm text-gray-700">{user?.name}</span>
                </div>
                <button onClick={logout} className="text-sm text-gray-500 hover:text-red-600">Logout</button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-indigo-600">Login</Link>
                <Link to="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-2">
            <Link to="/" className="block text-gray-600 hover:text-indigo-600 py-2" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/student/courses" className="block text-gray-600 hover:text-indigo-600 py-2" onClick={() => setMenuOpen(false)}>Courses</Link>
            <Link to="/student/tests" className="block text-gray-600 hover:text-indigo-600 py-2" onClick={() => setMenuOpen(false)}>Test Series</Link>
            <Link to="/student/resources" className="block text-gray-600 hover:text-indigo-600 py-2" onClick={() => setMenuOpen(false)}>Resources</Link>
            <Link to="/student/mentorship" className="block text-gray-600 hover:text-indigo-600 py-2" onClick={() => setMenuOpen(false)}>Mentors</Link>
            {isAuthenticated ? (
              <>
                <Link to={getDashboardLink()} className="block text-indigo-600 py-2" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <button onClick={() => { logout(); setMenuOpen(false); }} className="block text-red-500 py-2">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-gray-600 py-2" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/signup" className="block bg-indigo-600 text-white text-center py-2 rounded-lg" onClick={() => setMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
