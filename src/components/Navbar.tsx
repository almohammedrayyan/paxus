import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout as clearSession } from '@/store/authSlice';
import { useLogoutMutation } from '@/store/authApi';

const navigation = [
  { label: 'Explore', to: '/student/courses' },
  { label: 'Test series', to: '/student/tests' },
  { label: 'Resources', to: '/student/resources' },
  { label: 'Mentors', to: '/student/mentorship' },
];

export default function Navbar() {
  const dispatch = useAppDispatch();
  const session = useAppSelector((state) => state.auth.session);
  const user = session?.user ?? null;
  const [logoutRequest] = useLogoutMutation();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const getDashboardLink = () => (user ? `/${user.role}` : '/login');
  const isActive = (to: string) => location.pathname === to;
  const logout = () => {
    if (session?.refreshToken) void logoutRequest({ refreshToken: session.refreshToken });
    dispatch(clearSession());
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[4.5rem] items-center justify-between gap-4">
          <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="PAxus home">
            <span className="h-7 w-1 rounded-full bg-gradient-to-b from-violet-500 to-sky-500" aria-hidden="true" />
            <span className="text-xl font-bold tracking-tight text-slate-950"><span className="text-indigo-600">PA</span>xus</span>
          </Link>

          <div className="hidden shrink-0 items-center gap-7 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`whitespace-nowrap border-b-2 py-2 text-sm font-medium transition ${isActive(item.to) ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-950'}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <>
                <Link to={getDashboardLink()} className="text-sm font-semibold text-slate-700 transition hover:text-indigo-700">Dashboard</Link>
                <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-violet-100 to-sky-100 text-sm font-bold text-indigo-700">{user?.name?.charAt(0)}</div>
                  <button onClick={logout} className="text-sm font-medium text-slate-500 transition hover:text-rose-600">Log out</button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="px-2 text-sm font-semibold text-slate-600 transition hover:text-indigo-700">Log in</Link>
                <Link to="/signup" className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-indigo-700">Get started <span aria-hidden="true">→</span></Link>
              </>
            )}
          </div>

          <button type="button" onClick={() => setMenuOpen((open) => !open)} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 md:hidden" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen}>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m6 6 12 12M6 18 18 6" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white shadow-xl shadow-slate-900/5 md:hidden">
          <div className="mx-auto max-w-7xl px-5 py-5">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Navigate</p>
            <div className="border-y border-slate-100">
              <Link to="/" className={`flex items-center justify-between border-b border-slate-100 py-3.5 text-sm font-semibold ${location.pathname === '/' ? 'text-indigo-700' : 'text-slate-700'}`} onClick={() => setMenuOpen(false)}>
                Home <span className="text-slate-300" aria-hidden="true">→</span>
              </Link>
              {navigation.map((item) => (
                <Link key={item.to} to={item.to} className={`flex items-center justify-between border-b border-slate-100 py-3.5 text-sm font-semibold last:border-b-0 ${isActive(item.to) ? 'text-indigo-700' : 'text-slate-700'}`} onClick={() => setMenuOpen(false)}>
                  {item.label} <span className="text-slate-300" aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
            <div className="mt-5">
              {user ? (
                <>
                  <Link to={getDashboardLink()} className="flex items-center justify-between py-3 text-sm font-semibold text-indigo-700" onClick={() => setMenuOpen(false)}>Go to dashboard <span aria-hidden="true">→</span></Link>
                  <button onClick={() => { logout(); setMenuOpen(false); }} className="py-3 text-sm font-semibold text-rose-600">Log out</button>
                </>
              ) : (
                <div className="flex items-center gap-5">
                  <Link to="/login" className="py-3 text-sm font-semibold text-slate-700" onClick={() => setMenuOpen(false)}>Log in</Link>
                  <Link to="/signup" className="border-b-2 border-indigo-600 py-3 text-sm font-semibold text-indigo-700" onClick={() => setMenuOpen(false)}>Get started</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
