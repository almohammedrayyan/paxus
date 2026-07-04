import { mockTransactions, platformAnalytics } from '@/lib/data';

export default function AdminRevenuePage() {
  const totalPlatformShare = mockTransactions.reduce((sum, t) => sum + t.platformShare, 0);
  const totalProviderShare = mockTransactions.reduce((sum, t) => sum + t.providerShare, 0);
  const maxRevenue = Math.max(...platformAnalytics.monthlyRevenue.map(m => m.revenue));

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Revenue & Subscriptions</h1>
      <p className="mt-1 text-gray-500">Platform-wide revenue management and subscription analytics</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-5">
          <div className="text-sm text-gray-500">Total Platform Revenue</div>
          <div className="text-2xl font-bold text-gray-900">₹{(platformAnalytics.totalRevenue / 10000000).toFixed(2)} Cr</div>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="text-sm text-gray-500">Platform Earnings</div>
          <div className="text-2xl font-bold text-green-600">₹{(totalPlatformShare / 1000).toFixed(1)}K</div>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="text-sm text-gray-500">Provider Payouts</div>
          <div className="text-2xl font-bold text-blue-600">₹{(totalProviderShare / 1000).toFixed(1)}K</div>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="text-sm text-gray-500">Premium Subscribers</div>
          <div className="text-2xl font-bold text-purple-600">4,200</div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Monthly Revenue Trend</h3>
        <div className="flex items-end gap-4 h-48">
          {platformAnalytics.monthlyRevenue.map(m => (
            <div key={m.month} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-indigo-500 rounded-t" style={{ height: `${(m.revenue / maxRevenue) * 160}px` }}></div>
              <div className="text-xs text-gray-500 mt-2">{m.month.split(' ')[0]}</div>
              <div className="text-xs font-medium">₹{(m.revenue / 100000).toFixed(1)}L</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Revenue by Stakeholder</h3>
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left text-gray-500"><th className="pb-3">Type</th><th className="pb-3">Count</th><th className="pb-3">Revenue</th><th className="pb-3">Platform Share</th></tr></thead>
            <tbody>
              <tr className="border-b"><td className="py-3 font-medium">Institutes</td><td>45</td><td>₹28.5L</td><td>₹4.3L</td></tr>
              <tr className="border-b"><td className="py-3 font-medium">Educators</td><td>320</td><td>₹12.8L</td><td>₹2.6L</td></tr>
              <tr><td className="py-3 font-medium">Publishers</td><td>18</td><td>₹4.3L</td><td>₹0.9L</td></tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Commission Configuration</h3>
          <div className="space-y-3">
            {[
              { category: 'Course Sales', rate: '15%' },
              { category: 'Test Series', rate: '15%' },
              { category: 'Mentor Sessions', rate: '20%' },
              { category: 'Resource Sales', rate: '20%' },
              { category: 'Subscriptions', rate: '100% (platform)' },
            ].map(c => (
              <div key={c.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">{c.category}</span>
                <span className="text-sm font-medium text-indigo-600">{c.rate}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Subscription Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Free', price: '₹0', users: '114,300', features: ['Free resources', 'Community forums', 'Basic test series', 'Exam notifications'] },
            { name: 'Premium', price: '₹999/mo', users: '3,400', features: ['Ad-free experience', 'Premium materials', 'Doubt clearing (5/mo)', 'Performance analytics', 'Priority support'] },
            { name: 'Premium Plus', price: '₹1,999/mo', users: '800', features: ['All Premium features', 'Unlimited doubt clearing', 'Personal mentor', 'Exclusive live sessions', 'Answer evaluation'] },
          ].map(plan => (
            <div key={plan.name} className={`rounded-xl border p-5 ${plan.name === 'Premium' ? 'border-indigo-300 bg-indigo-50' : ''}`}>
              <h4 className="font-semibold text-gray-900">{plan.name}</h4>
              <div className="text-2xl font-bold mt-1">{plan.price}</div>
              <div className="text-sm text-gray-500 mt-1">{plan.users} users</div>
              <ul className="mt-3 space-y-1">
                {plan.features.map(f => (
                  <li key={f} className="text-xs text-gray-600 flex items-center gap-1">
                    <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Transactions</h3>
        <table className="w-full text-sm">
          <thead><tr className="border-b text-left text-gray-500"><th className="pb-3 pr-3">Date</th><th className="pb-3 pr-3">Type</th><th className="pb-3 pr-3">Description</th><th className="pb-3 pr-3">Amount</th><th className="pb-3 pr-3">Platform</th><th className="pb-3">Status</th></tr></thead>
          <tbody>
            {mockTransactions.map(txn => (
              <tr key={txn.id} className="border-b last:border-0">
                <td className="py-2.5 pr-3 text-gray-500">{txn.date}</td>
                <td className="py-2.5 pr-3"><span className="px-2 py-0.5 text-xs rounded-full bg-gray-100">{txn.type.replace(/_/g, ' ')}</span></td>
                <td className="py-2.5 pr-3 font-medium text-gray-900 max-w-[200px] truncate">{txn.description}</td>
                <td className="py-2.5 pr-3">₹{txn.amount.toLocaleString()}</td>
                <td className="py-2.5 pr-3 text-green-600">₹{txn.platformShare.toLocaleString()}</td>
                <td className="py-2.5"><span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">{txn.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

