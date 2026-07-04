import { mockTransactions } from '@/lib/data';

export default function EducatorRevenuePage() {
  const eduTransactions = mockTransactions.filter(t => t.providerId === 'edu-1');
  const totalEarnings = eduTransactions.reduce((sum, t) => sum + t.providerShare, 0);

  const monthlyData = [
    { month: 'Sep', earnings: 32000 },
    { month: 'Oct', earnings: 45000 },
    { month: 'Nov', earnings: 52000 },
    { month: 'Dec', earnings: 68000 },
    { month: 'Jan', earnings: 78000 },
    { month: 'Feb', earnings: 64000 },
  ];
  const maxEarnings = Math.max(...monthlyData.map(d => d.earnings));

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Revenue Management</h1>
      <p className="mt-1 text-gray-500">Track your earnings and manage payouts</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-5">
          <div className="text-sm text-gray-500">Total Earnings</div>
          <div className="text-3xl font-bold text-gray-900 mt-1">₹{totalEarnings.toLocaleString()}</div>
          <div className="text-xs text-green-600 mt-1">Lifetime earnings</div>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="text-sm text-gray-500">This Month</div>
          <div className="text-3xl font-bold text-indigo-600 mt-1">₹64,000</div>
          <div className="text-xs text-green-600 mt-1">+12% from last month</div>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="text-sm text-gray-500">Pending Payout</div>
          <div className="text-3xl font-bold text-orange-600 mt-1">₹12,800</div>
          <div className="text-xs text-gray-400 mt-1">Next payout: Feb 15</div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Monthly Earnings</h3>
        <div className="flex items-end gap-4 h-48">
          {monthlyData.map(d => (
            <div key={d.month} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-indigo-500 rounded-t" style={{ height: `${(d.earnings / maxEarnings) * 160}px` }}></div>
              <div className="text-xs text-gray-500 mt-2">{d.month}</div>
              <div className="text-xs font-medium">₹{(d.earnings / 1000).toFixed(0)}K</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Revenue by Course</h3>
        <div className="space-y-3">
          {[
            { course: 'GS Mains Answer Writing Mastery', students: 3450, revenue: 180000 },
            { course: 'Ethics, Integrity & Aptitude', students: 2800, revenue: 95000 },
            { course: 'Sociology Optional Crash Course', students: 1200, revenue: 64000 },
          ].map(c => (
            <div key={c.course} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">{c.course}</div>
                <div className="text-xs text-gray-500">{c.students} students enrolled</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900">₹{(c.revenue / 1000).toFixed(0)}K</div>
                <div className="text-xs text-gray-500">total revenue</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Transaction History</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-3 pr-4">Date</th>
              <th className="pb-3 pr-4">Description</th>
              <th className="pb-3 pr-4">Total</th>
              <th className="pb-3 pr-4">Your Share (80%)</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {eduTransactions.map(txn => (
              <tr key={txn.id} className="border-b last:border-0">
                <td className="py-3 pr-4 text-gray-500">{txn.date}</td>
                <td className="py-3 pr-4 font-medium text-gray-900">{txn.description}</td>
                <td className="py-3 pr-4">₹{txn.amount.toLocaleString()}</td>
                <td className="py-3 pr-4 text-green-600 font-medium">₹{txn.providerShare.toLocaleString()}</td>
                <td className="py-3"><span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">{txn.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 bg-white rounded-xl border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Bank Details</h3>
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-600">SBI Account: ****7890</div>
            <div className="text-xs text-gray-400 mt-1">IFSC: SBIN0001234 | Revenue share: 80% educator, 20% platform</div>
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">Request Payout</button>
        </div>
      </div>
    </div>
  );
}

