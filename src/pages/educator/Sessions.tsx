import { useState } from 'react';
import { mockLiveClasses, mockForumPosts } from '@/lib/data';

export default function EducatorSessionsPage() {
  const [showForm, setShowForm] = useState(false);
  const mySessions = mockLiveClasses.filter(lc => lc.educatorId === 'edu-1');
  const myPosts = mockForumPosts.filter(p => p.authorId === 'edu-1');
  const statusColors: Record<string, string> = { upcoming: 'bg-blue-100 text-blue-700', live: 'bg-red-100 text-red-700', completed: 'bg-gray-100 text-gray-600' };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Live Sessions</h1>
          <p className="mt-1 text-gray-500">Manage your live classes and engage with students</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
          + Schedule Session
        </button>
      </div>

      {showForm && (
        <div className="mt-4 bg-white rounded-xl border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Schedule New Session</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label><input type="text" className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Session title" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Subject</label><input type="text" className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="e.g., Current Affairs" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Date</label><input type="date" className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Time</label><input type="time" className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label><input type="number" defaultValue={60} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Max Capacity</label><input type="number" defaultValue={300} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          </div>
          <div className="mt-4 flex gap-2 justify-end">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
            <button onClick={() => { alert('Session scheduled!'); setShowForm(false); }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">Schedule</button>
          </div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{mySessions.length}</div>
          <div className="text-sm text-gray-500">Total Sessions</div>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">89%</div>
          <div className="text-sm text-gray-500">Avg Attendance</div>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">4.8</div>
          <div className="text-sm text-gray-500">Avg Student Rating</div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="font-semibold text-gray-900 mb-4">Your Sessions</h3>
        <div className="space-y-3">
          {mySessions.map(session => (
            <div key={session.id} className="bg-white rounded-xl border p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${session.status === 'live' ? 'bg-red-500 animate-pulse' : session.status === 'upcoming' ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                <div>
                  <h4 className="font-medium text-gray-900">{session.title}</h4>
                  <div className="text-sm text-gray-500">{session.subject} | {session.duration} min | {new Date(session.scheduledAt).toLocaleString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">{session.enrolledCount}/{session.maxCapacity}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[session.status]}`}>{session.status}</span>
                {session.status === 'upcoming' && <button className="text-sm text-indigo-600 hover:text-indigo-700">Start</button>}
                {session.status === 'completed' && <button className="text-sm text-indigo-600 hover:text-indigo-700">Recording</button>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="font-semibold text-gray-900 mb-4">Your Forum Activity</h3>
        <div className="space-y-3">
          {myPosts.map(post => (
            <div key={post.id} className="bg-white rounded-xl border p-4">
              <h4 className="font-medium text-gray-900">{post.title}</h4>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{post.content}</p>
              <div className="mt-2 flex gap-4 text-xs text-gray-400">
                <span>{post.replies} replies</span>
                <span>{post.likes} likes</span>
                <span>{post.date}</span>
              </div>
            </div>
          ))}
          {myPosts.length === 0 && (
            <div className="bg-white rounded-xl border p-8 text-center text-gray-400">
              <p>No forum posts yet. Start engaging with students!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

