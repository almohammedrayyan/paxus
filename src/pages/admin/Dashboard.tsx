import { useState } from 'react';
import { platformAnalytics, mockSubmissions, mockTickets } from '@/lib/data';

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');

  const pendingSubmissions = mockSubmissions.filter(s => s.status === 'pending').length;
  const openTickets = mockTickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;

  const maxRevenue = Math.max(...platformAnalytics.monthlyRevenue.map(m => m.revenue));
  const maxSearches = Math.max(...platformAnalytics.topSubjects.map(s => s.searches));

  const recentActivities = [
    { id: 1, type: 'submission', text: 'Shankar IAS Academy submitted "Advanced CSAT Course" for review', time: '2 hours ago', color: 'bg-blue-500' },
    { id: 2, type: 'ticket', text: 'New support ticket: "Payment failed but amount deducted" by Priya Sharma', time: '5 hours ago', color: 'bg-red-500' },
    { id: 3, type: 'registration', text: '15 new student registrations from Delhi today', time: '6 hours ago', color: 'bg-green-500' },
    { id: 4, type: 'submission', text: 'Prof. Meera Krishnan submitted "Modern India Test Series"', time: '1 day ago', color: 'bg-blue-500' },
    { id: 5, type: 'ticket', text: 'Ticket resolved: "Incorrect question in mock test"', time: '1 day ago', color: 'bg-yellow-500' },
    { id: 6, type: 'registration', text: 'New institute registered: ABC Academy, Jaipur', time: '2 days ago', color: 'bg-green-500' },
    { id: 7, type: 'submission', text: 'Orient BlackSwan submitted "Art & Culture Quick Revision Notes"', time: '3 days ago', color: 'bg-blue-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Platform overview and key metrics</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
          {(['week', 'month', 'quarter'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                timeRange === range
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Platform Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Users', value: platformAnalytics.totalUsers.toLocaleString('en-IN'), icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', color: 'bg-indigo-50 text-indigo-600' },
          { label: 'Students', value: platformAnalytics.totalStudents.toLocaleString('en-IN'), icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', color: 'bg-blue-50 text-blue-600' },
          { label: 'Institutes', value: platformAnalytics.totalInstitutes.toString(), icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', color: 'bg-purple-50 text-purple-600' },
          { label: 'Educators', value: platformAnalytics.totalEducators.toString(), icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', color: 'bg-green-50 text-green-600' },
          { label: 'Publishers', value: platformAnalytics.totalPublishers.toString(), icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', color: 'bg-orange-50 text-orange-600' },
          { label: 'Active Users', value: platformAnalytics.monthlyActiveUsers.toLocaleString('en-IN'), icon: 'M13 10V3L4 14h7v7l9-11h-7z', color: 'bg-teal-50 text-teal-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                </svg>
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900 mt-3">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue + MAU Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {'\u20B9'}4.56 Cr
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              18.2%
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Compared to last quarter</p>
          <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full" style={{ width: '72%' }}></div>
          </div>
          <p className="text-xs text-gray-400 mt-1">72% of quarterly target</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Monthly Active Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {platformAnalytics.monthlyActiveUsers.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              12.5%
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {((platformAnalytics.monthlyActiveUsers / platformAnalytics.totalUsers) * 100).toFixed(1)}% of total users
          </p>
          <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{ width: `${((platformAnalytics.monthlyActiveUsers / platformAnalytics.totalUsers) * 100)}%` }}></div>
          </div>
          <p className="text-xs text-gray-400 mt-1">{((platformAnalytics.monthlyActiveUsers / platformAnalytics.totalUsers) * 100).toFixed(1)}% engagement rate</p>
        </div>
      </div>

      {/* Pending Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-amber-800">Content Submissions Pending</p>
            <p className="text-xs text-amber-600 mt-0.5">Requires review and approval</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-amber-700">{pendingSubmissions}</span>
            <a href="/admin/moderation" className="text-sm font-medium text-amber-700 hover:text-amber-900 underline">Review</a>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-red-800">Open Support Tickets</p>
            <p className="text-xs text-red-600 mt-0.5">Pending resolution</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-red-700">{openTickets}</span>
            <a href="/admin/support" className="text-sm font-medium text-red-700 hover:text-red-900 underline">View</a>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900">Monthly Revenue</h3>
          <p className="text-sm text-gray-500 mt-0.5 mb-6">Revenue trend over last 6 months</p>
          <div className="flex items-end gap-3 h-48">
            {platformAnalytics.monthlyRevenue.map((item) => {
              const heightPercent = (item.revenue / maxRevenue) * 100;
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-medium text-gray-700">
                    {'\u20B9'}{(item.revenue / 100000).toFixed(1)}L
                  </span>
                  <div className="w-full relative" style={{ height: '160px' }}>
                    <div
                      className="absolute bottom-0 w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-md transition-all duration-500 hover:from-indigo-700 hover:to-indigo-500"
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {item.month.split(' ')[0].slice(0, 3)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Subjects Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900">Top Subject Searches</h3>
          <p className="text-sm text-gray-500 mt-0.5 mb-6">Most searched subjects on the platform</p>
          <div className="space-y-4">
            {platformAnalytics.topSubjects.map((item) => {
              const widthPercent = (item.searches / maxSearches) * 100;
              const colors = ['bg-indigo-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-teal-500'];
              const index = platformAnalytics.topSubjects.indexOf(item);
              return (
                <div key={item.subject}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.subject}</span>
                    <span className="text-sm text-gray-500">{(item.searches / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colors[index % colors.length]} rounded-full transition-all duration-500`}
                      style={{ width: `${widthPercent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row: City-wise + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* City-wise User Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900">City-wise User Distribution</h3>
          <p className="text-sm text-gray-500 mt-0.5 mb-4">Top cities by registered users</p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 pr-4">Rank</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 pr-4">City</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 pr-4">Users</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3">Share</th>
                </tr>
              </thead>
              <tbody>
                {platformAnalytics.cityWiseUsers.map((city, index) => {
                  const share = ((city.users / platformAnalytics.totalUsers) * 100).toFixed(1);
                  return (
                    <tr key={city.city} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-3 pr-4">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                          index < 3 ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-sm font-medium text-gray-900">{city.city}</td>
                      <td className="py-3 pr-4 text-sm text-gray-600 text-right">{city.users.toLocaleString('en-IN')}</td>
                      <td className="py-3 text-sm text-gray-500 text-right">{share}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <p className="text-sm text-gray-500 mt-0.5 mb-4">Latest platform events</p>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${activity.color}`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">{activity.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

