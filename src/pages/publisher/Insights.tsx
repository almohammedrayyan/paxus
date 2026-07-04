import { platformAnalytics, mockResources } from '@/lib/data';

export default function PublisherInsightsPage() {
  const myResources = mockResources.filter(r => r.providerId === 'pub-1');

  const downloadData = [
    { month: 'Sep', downloads: 8200 },
    { month: 'Oct', downloads: 9400 },
    { month: 'Nov', downloads: 10800 },
    { month: 'Dec', downloads: 11200 },
    { month: 'Jan', downloads: 13500 },
    { month: 'Feb', downloads: 12400 },
  ];
  const maxDownloads = Math.max(...downloadData.map(d => d.downloads));

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Publisher Insights</h1>
      <p className="mt-1 text-gray-500">Analytics on downloads, revenue, and content performance</p>

      <div className="mt-8 bg-white rounded-xl border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Download Trends (Last 6 Months)</h3>
        <div className="flex items-end gap-4 h-48">
          {downloadData.map(d => (
            <div key={d.month} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-indigo-500 rounded-t" style={{ height: `${(d.downloads / maxDownloads) * 160}px` }}></div>
              <div className="text-xs text-gray-500 mt-2">{d.month}</div>
              <div className="text-xs font-medium">{(d.downloads / 1000).toFixed(1)}K</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Subject Popularity</h3>
          <div className="space-y-3">
            {platformAnalytics.topSubjects.map(s => (
              <div key={s.subject} className="flex items-center gap-3">
                <div className="w-24 text-sm text-gray-600">{s.subject}</div>
                <div className="flex-1 bg-gray-100 rounded-full h-4">
                  <div className="bg-green-500 rounded-full h-4" style={{ width: `${(s.searches / platformAnalytics.topSubjects[0].searches) * 100}%` }}></div>
                </div>
                <span className="text-sm font-medium w-16 text-right">{(s.searches / 1000).toFixed(0)}K</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Revenue by Type</h3>
          <div className="space-y-4">
            {[
              { type: 'E-Books', revenue: 340000, percentage: 40 },
              { type: 'PDFs', revenue: 255000, percentage: 30 },
              { type: 'Magazines', revenue: 170000, percentage: 20 },
              { type: 'Notes', revenue: 85000, percentage: 10 },
            ].map(t => (
              <div key={t.type}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{t.type}</span>
                  <span className="font-medium">₹{(t.revenue / 1000).toFixed(0)}K ({t.percentage}%)</span>
                </div>
                <div className="bg-gray-100 rounded-full h-2">
                  <div className="bg-indigo-500 rounded-full h-2" style={{ width: `${t.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Popular Resources Ranking</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-3 pr-4">#</th>
              <th className="pb-3 pr-4">Title</th>
              <th className="pb-3 pr-4">Subject</th>
              <th className="pb-3 pr-4">Type</th>
              <th className="pb-3 pr-4">Downloads</th>
              <th className="pb-3">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {myResources.map((res, i) => (
              <tr key={res.id} className="border-b last:border-0">
                <td className="py-3 pr-4 font-medium">{i + 1}</td>
                <td className="py-3 pr-4 font-medium text-gray-900">{res.title}</td>
                <td className="py-3 pr-4 text-gray-500">{res.subject}</td>
                <td className="py-3 pr-4"><span className="px-2 py-0.5 text-xs rounded-full bg-gray-100">{res.type}</span></td>
                <td className="py-3 pr-4">{(3000 - i * 800).toLocaleString()}</td>
                <td className="py-3">₹{((3000 - i * 800) * (res.price || 0) / 1000).toFixed(0)}K</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">City-wise Reader Distribution</h3>
          <div className="space-y-2">
            {platformAnalytics.cityWiseUsers.slice(0, 6).map(city => (
              <div key={city.city} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                <span className="text-gray-700">{city.city}</span>
                <span className="font-medium">{(city.users / 1000).toFixed(1)}K readers</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Trending Topics Students Search</h3>
          <p className="text-sm text-gray-500 mb-3">Create content around these high-demand topics</p>
          <div className="flex flex-wrap gap-2">
            {platformAnalytics.topSubjects.map(s => (
              <span key={s.subject} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                {s.subject} ({(s.searches / 1000).toFixed(0)}K)
              </span>
            ))}
            <span className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full text-sm font-medium">CSAT (15K)</span>
            <span className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium">Art & Culture (12K)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

