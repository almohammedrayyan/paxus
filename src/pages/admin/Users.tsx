import { useState } from 'react';
import { mockStudents, mockInstitutes, mockEducators, mockPublishers } from '@/lib/data';

export default function AdminUsersPage() {
  const [tab, setTab] = useState<'students' | 'institutes' | 'educators' | 'publishers'>('students');
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const tabs = [
    { key: 'students' as const, label: 'Students', count: mockStudents.length },
    { key: 'institutes' as const, label: 'Institutes', count: mockInstitutes.length },
    { key: 'educators' as const, label: 'Educators', count: mockEducators.length },
    { key: 'publishers' as const, label: 'Publishers', count: mockPublishers.length },
  ];

  const getCurrentUsers = () => {
    switch (tab) {
      case 'students': return mockStudents.map(s => ({ id: s.id, name: s.name, email: s.email, city: s.city, date: s.createdAt, verified: true, extra: `${s.targetExam} - ${s.stage}` }));
      case 'institutes': return mockInstitutes.map(i => ({ id: i.id, name: i.instituteName, email: i.email, city: i.city, date: i.createdAt, verified: i.verified, extra: `${i.coursesCount} courses | ${i.studentsCount} students` }));
      case 'educators': return mockEducators.map(e => ({ id: e.id, name: e.name, email: e.email, city: e.city, date: e.createdAt, verified: e.verified, extra: e.specializations.join(', ') }));
      case 'publishers': return mockPublishers.map(p => ({ id: p.id, name: p.publisherName, email: p.email, city: p.city, date: p.createdAt, verified: p.verified, extra: `${p.booksCount} books` }));
    }
  };

  const users = getCurrentUsers().filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
      <p className="mt-1 text-gray-500">Manage all platform users across different roles</p>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">118,500</div>
          <div className="text-sm text-gray-500">Students</div>
          <div className="text-xs text-green-600 mt-1">+2,400 this month</div>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">45</div>
          <div className="text-sm text-gray-500">Institutes</div>
          <div className="text-xs text-green-600 mt-1">+3 this month</div>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">320</div>
          <div className="text-sm text-gray-500">Educators</div>
          <div className="text-xs text-green-600 mt-1">+15 this month</div>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">18</div>
          <div className="text-sm text-gray-500">Publishers</div>
          <div className="text-xs text-green-600 mt-1">+1 this month</div>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === t.key ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}>
              {t.label} ({t.count})
            </button>
          ))}
        </div>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="flex-1 border rounded-lg px-3 py-2 text-sm" />
      </div>

      <div className="mt-6 bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left text-gray-500">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">City</th>
              <th className="p-3">Details</th>
              <th className="p-3">Joined</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-3 font-medium text-gray-900">{user.name}</td>
                <td className="p-3 text-gray-500">{user.email}</td>
                <td className="p-3 text-gray-500">{user.city}</td>
                <td className="p-3 text-gray-500 text-xs">{user.extra}</td>
                <td className="p-3 text-gray-500">{user.date}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 text-xs rounded-full ${user.verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {user.verified ? 'Verified' : 'Pending'}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedUser(user.id)} className="text-xs text-indigo-600 hover:text-indigo-700">View</button>
                    <button className="text-xs text-gray-500 hover:text-gray-700">Suspend</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedUser(null)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold">User Details</h3>
            {(() => {
              const user = users.find(u => u.id === selectedUser);
              if (!user) return null;
              return (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-bold">{user.name.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-2 bg-gray-50 rounded"><span className="text-gray-500">City:</span> {user.city}</div>
                    <div className="p-2 bg-gray-50 rounded"><span className="text-gray-500">Joined:</span> {user.date}</div>
                    <div className="p-2 bg-gray-50 rounded col-span-2"><span className="text-gray-500">Details:</span> {user.extra}</div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button onClick={() => setSelectedUser(null)} className="flex-1 px-4 py-2 border rounded-lg text-sm">Close</button>
                    <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm">Verify</button>
                    <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm">Suspend</button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

