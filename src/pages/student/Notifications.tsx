import { useState } from 'react';
import { mockNotifications } from '@/lib/data';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState('all');

  const typeIcons: Record<string, string> = {
    exam: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    course: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    test: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    deadline: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    general: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
  };
  const typeColors: Record<string, string> = { exam: 'bg-red-100 text-red-600', course: 'bg-blue-100 text-blue-600', test: 'bg-green-100 text-green-600', deadline: 'bg-orange-100 text-orange-600', general: 'bg-gray-100 text-gray-600' };

  const filtered = filter === 'all' ? notifications : notifications.filter(n => n.type === filter);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-1 text-gray-500">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setNotifications(ns => ns.map(n => ({ ...n, read: true })))} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
          Mark all as read
        </button>
      </div>

      <div className="mt-6 flex gap-2 flex-wrap">
        {['all', 'exam', 'course', 'test', 'deadline', 'general'].map(t => (
          <button key={t} onClick={() => setFilter(t)} className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize ${filter === t ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}>
            {t === 'all' ? 'All' : t}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {filtered.map(notif => (
          <div key={notif.id} className={`bg-white rounded-xl border p-4 flex items-start gap-4 ${!notif.read ? 'border-indigo-200 bg-indigo-50/30' : ''}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${typeColors[notif.type]}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={typeIcons[notif.type]} />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className={`text-sm font-semibold ${!notif.read ? 'text-gray-900' : 'text-gray-700'}`}>{notif.title}</h3>
                {!notif.read && <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>}
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{notif.message}</p>
              <span className="text-xs text-gray-400 mt-1 block">{notif.date}</span>
            </div>
            <button onClick={() => setNotifications(ns => ns.map(n => n.id === notif.id ? { ...n, read: true } : n))} className="text-xs text-gray-400 hover:text-gray-600 flex-shrink-0">
              {!notif.read ? 'Mark read' : ''}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

