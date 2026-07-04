import { useState } from 'react';
import { mockLiveClasses } from '@/lib/data';

export default function InstituteClassesPage() {
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const statusColors: Record<string, string> = { upcoming: 'bg-blue-100 text-blue-700', live: 'bg-red-100 text-red-700', completed: 'bg-gray-100 text-gray-600' };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Live Class Management</h1>
          <p className="mt-1 text-gray-500">Schedule and manage live classes for your students</p>
        </div>
        <button onClick={() => setShowScheduleForm(!showScheduleForm)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
          + Schedule New Class
        </button>
      </div>

      {showScheduleForm && (
        <div className="mt-4 bg-white rounded-xl border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Schedule a New Live Class</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label><input type="text" className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Class title" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Subject</label><input type="text" className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Subject" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Date</label><input type="date" className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Time</label><input type="time" className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label><input type="number" className="w-full border rounded-lg px-3 py-2 text-sm" defaultValue={60} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Max Capacity</label><input type="number" className="w-full border rounded-lg px-3 py-2 text-sm" defaultValue={200} /></div>
          </div>
          <div className="mt-4 flex gap-2 justify-end">
            <button onClick={() => setShowScheduleForm(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
            <button onClick={() => { alert('Class scheduled!'); setShowScheduleForm(false); }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">Schedule</button>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h3 className="font-semibold text-gray-900 mb-4">Weekly Schedule</h3>
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="grid grid-cols-7 border-b bg-gray-50">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="p-3 text-center text-sm font-medium text-gray-600 border-r last:border-r-0">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 min-h-[200px]">
            {[0, 1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="border-r last:border-r-0 p-2">
                {i === 0 && <div className="bg-blue-50 border border-blue-200 rounded p-1.5 text-xs mb-1"><div className="font-medium text-blue-700">Current Affairs</div><div className="text-blue-500">6:00 PM</div></div>}
                {i === 2 && <div className="bg-red-50 border border-red-200 rounded p-1.5 text-xs mb-1"><div className="font-medium text-red-700">History Lecture</div><div className="text-red-500">2:00 PM</div></div>}
                {i === 5 && <div className="bg-green-50 border border-green-200 rounded p-1.5 text-xs"><div className="font-medium text-green-700">Geography Maps</div><div className="text-green-500">10:00 AM</div></div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="font-semibold text-gray-900 mb-4">All Classes</h3>
        <div className="space-y-3">
          {mockLiveClasses.map(lc => (
            <div key={lc.id} className="bg-white rounded-xl border p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${lc.status === 'live' ? 'bg-red-500 animate-pulse' : lc.status === 'upcoming' ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                <div>
                  <h4 className="font-medium text-gray-900">{lc.title}</h4>
                  <div className="text-sm text-gray-500">{lc.educator} | {lc.subject} | {lc.duration} mins</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-500">{new Date(lc.scheduledAt).toLocaleString()}</div>
                <div className="text-sm">{lc.enrolledCount}/{lc.maxCapacity} enrolled</div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[lc.status]}`}>{lc.status}</span>
                {lc.status === 'completed' && lc.recordingUrl && (
                  <button className="text-xs text-indigo-600 hover:text-indigo-700">View Recording</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

