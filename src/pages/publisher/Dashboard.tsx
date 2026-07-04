import { Link } from 'react-router-dom';
import { mockResources, mockReviews } from '@/lib/data';

export default function PublisherDashboardPage() {
  const myResources = mockResources.filter(r => r.providerId === 'pub-1');

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold">T</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Tata McGraw Hill</h1>
            <p className="text-indigo-100 mt-1">Leading publisher for competitive exam preparation books</p>
            <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              Verified Publisher
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Books Listed', value: '35', icon: 'text-blue-600 bg-blue-100' },
          { label: 'Downloads (Month)', value: '12,400', icon: 'text-green-600 bg-green-100' },
          { label: 'Revenue', value: '₹8.5L', icon: 'text-indigo-600 bg-indigo-100' },
          { label: 'Avg Rating', value: '4.5', icon: 'text-yellow-600 bg-yellow-100' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border p-5">
            <div className="text-sm text-gray-500">{stat.label}</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-xl border p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900">Top Selling Resources</h3>
          <Link to="/publisher/catalog" className="text-sm text-indigo-600 hover:text-indigo-700">View All →</Link>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-3 pr-4">Title</th>
              <th className="pb-3 pr-4">Type</th>
              <th className="pb-3 pr-4">Subject</th>
              <th className="pb-3 pr-4">Price</th>
              <th className="pb-3">Downloads</th>
            </tr>
          </thead>
          <tbody>
            {myResources.map(res => (
              <tr key={res.id} className="border-b last:border-0">
                <td className="py-3 pr-4 font-medium text-gray-900">{res.title}</td>
                <td className="py-3 pr-4"><span className="px-2 py-0.5 text-xs rounded-full bg-gray-100">{res.type.toUpperCase()}</span></td>
                <td className="py-3 pr-4 text-gray-500">{res.subject}</td>
                <td className="py-3 pr-4">{res.free ? <span className="text-green-600">Free</span> : `₹${res.price}`}</td>
                <td className="py-3">2,340</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/publisher/catalog" className="bg-white rounded-xl border p-5 hover:shadow-md transition text-center">
          <div className="text-indigo-600 font-semibold">Add New Resource</div>
          <div className="text-sm text-gray-500 mt-1">Upload books, PDFs, or magazines</div>
        </Link>
        <Link to="/publisher/catalog" className="bg-white rounded-xl border p-5 hover:shadow-md transition text-center">
          <div className="text-indigo-600 font-semibold">View Catalog</div>
          <div className="text-sm text-gray-500 mt-1">Manage your listed resources</div>
        </Link>
        <Link to="/publisher/insights" className="bg-white rounded-xl border p-5 hover:shadow-md transition text-center">
          <div className="text-indigo-600 font-semibold">Analytics</div>
          <div className="text-sm text-gray-500 mt-1">View download and revenue insights</div>
        </Link>
      </div>

      <div className="mt-8 bg-white rounded-xl border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Reviews</h3>
        {mockReviews.slice(0, 2).map(review => (
          <div key={review.id} className="border-b last:border-0 py-3">
            <div className="flex items-center gap-2">
              <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
              <span className="text-sm font-medium text-gray-700">{review.userName}</span>
              <span className="text-xs text-gray-400">{review.date}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

