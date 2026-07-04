import { mockTransactions } from '@/lib/data';

export default function InstitutePaymentsPage() {
  const instTransactions = mockTransactions.filter(t => t.providerId === 'inst-1');
  const totalRevenue = instTransactions.reduce((sum, t) => sum + t.providerShare, 0);
  const platformFees = instTransactions.reduce((sum, t) => sum + t.platformShare, 0);

  const monthlyData = [
    { month: 'Sep', revenue: 280000 },
    { month: 'Oct', revenue: 320000 },
    { month: 'Nov', revenue: 350000 },
    { month: 'Dec', revenue: 410000 },
    { month: 'Jan', revenue: 450000 },
    { month: 'Feb', revenue: 380000 },
  ];
  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
      <p className="mt-1 text-gray-500">Track your revenue, transactions, and payouts</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-5">
          <div className="text-sm text-gray-500">Total Revenue</div>
          <div className="text-3xl font-bold text-gray-900 mt-1">₹{(totalRevenue / 100000).toFixed(1)}L</div>
          <div className="text-xs text-green-600 mt-1">+18% from last month</div>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="text-sm text-gray-500">Pending Payout</div>
          <div className="text-3xl font-bold text-orange-600 mt-1">₹25,498</div>
          <div className="text-xs text-gray-400 mt-1">Next payout: Feb 15, 2026</div>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="text-sm text-gray-500">Platform Fees Paid</div>
          <div className="text-3xl font-bold text-gray-600 mt-1">₹{(platformFees / 1000).toFixed(1)}K</div>
          <div className="text-xs text-gray-400 mt-1">15% commission rate</div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
        <div className="flex items-end gap-4 h-48">
          {monthlyData.map(d => (
            <div key={d.month} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-indigo-500 rounded-t" style={{ height: `${(d.revenue / maxRevenue) * 160}px` }}></div>
              <div className="text-xs text-gray-500 mt-2">{d.month}</div>
              <div className="text-xs font-medium">₹{(d.revenue / 1000).toFixed(0)}K</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Transaction History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Description</th>
                <th className="pb-3 pr-4">Amount</th>
                <th className="pb-3 pr-4">Platform Fee</th>
                <th className="pb-3 pr-4">Net Earnings</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {instTransactions.map(txn => (
                <tr key={txn.id} className="border-b last:border-0">
                  <td className="py-3 pr-4 text-gray-500">{txn.date}</td>
                  <td className="py-3 pr-4 font-medium text-gray-900">{txn.description}</td>
                  <td className="py-3 pr-4">₹{txn.amount.toLocaleString()}</td>
                  <td className="py-3 pr-4 text-red-500">-₹{txn.platformShare.toLocaleString()}</td>
                  <td className="py-3 pr-4 text-green-600 font-medium">₹{txn.providerShare.toLocaleString()}</td>
                  <td className="py-3"><span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">{txn.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Payout Settings</h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">Bank Account: HDFC Bank ****4521</div>
            <div className="text-sm text-gray-400 mt-1">IFSC: HDFC0001234 | Auto-payout: Weekly</div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Edit Account</button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">Request Payout</button>
          </div>
        </div>
      </div>
    </div>
  );
}

