import { useState } from 'react';
import { mockResources } from '@/lib/data';

export default function PublisherCatalogPage() {
  const [showForm, setShowForm] = useState(false);
  const myResources = mockResources.filter(r => r.providerId === 'pub-1');
  const typeColors: Record<string, string> = { pdf: 'bg-red-100 text-red-700', ebook: 'bg-blue-100 text-blue-700', magazine: 'bg-purple-100 text-purple-700', notes: 'bg-green-100 text-green-700', video: 'bg-orange-100 text-orange-700' };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">E-Publishing Catalog</h1>
          <p className="mt-1 text-gray-500">Manage your published resources and subscriptions</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
          + Add New Resource
        </button>
      </div>

      {showForm && (
        <div className="mt-4 bg-white rounded-xl border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Add New Resource</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label><input type="text" className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Resource title" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm">
                <option>PDF</option><option>E-Book</option><option>Magazine</option><option>Notes</option><option>Video</option>
              </select>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Subject</label><input type="text" className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="e.g., History" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label><input type="number" className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="0 for free" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm"><option>English</option><option>Hindi</option><option>Tamil</option><option>Telugu</option></select>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label><input type="file" className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={3} placeholder="Describe the resource..."></textarea></div>
          </div>
          <div className="mt-4 flex gap-2 justify-end">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
            <button onClick={() => { alert('Resource added!'); setShowForm(false); }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">Publish</button>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h3 className="font-semibold text-gray-900 mb-4">Published Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myResources.map(res => (
            <div key={res.id} className="bg-white rounded-xl border p-5 hover:shadow-md transition">
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${typeColors[res.type]}`}>{res.type.toUpperCase()}</span>
                {res.free && <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">FREE</span>}
              </div>
              <h4 className="font-semibold text-gray-900 text-sm">{res.title}</h4>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{res.description}</p>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-gray-500">{res.subject}</span>
                <span className="font-bold text-gray-900">{res.free ? 'Free' : `₹${res.price}`}</span>
              </div>
              <div className="mt-2 text-xs text-gray-400">{res.pages ? `${res.pages} pages` : ''} {res.fileSize ? `| ${res.fileSize}` : ''}</div>
              <div className="mt-3 flex gap-2">
                <button className="flex-1 px-3 py-1.5 border rounded-lg text-xs hover:bg-gray-50">Edit</button>
                <button className="flex-1 px-3 py-1.5 border rounded-lg text-xs text-red-600 hover:bg-red-50">Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Magazine Subscriptions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Yojana Monthly', subscribers: 2400, price: 99, status: 'Active' },
            { name: 'Kurukshetra Monthly', subscribers: 1800, price: 99, status: 'Active' },
          ].map(mag => (
            <div key={mag.name} className="border rounded-lg p-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{mag.name}</div>
                <div className="text-xs text-gray-500">{mag.subscribers} subscribers | ₹{mag.price}/month</div>
              </div>
              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">{mag.status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Content Distribution</h3>
        <p className="text-sm text-gray-500 mb-4">Institutes and educators licensing your content</p>
        <div className="space-y-2">
          {[
            { partner: 'Vision IAS', content: 'NCERT Summary Notes', license: 'Non-exclusive' },
            { partner: 'Shankar IAS Academy', content: 'Ethics Case Studies', license: 'Exclusive' },
          ].map(deal => (
            <div key={deal.partner} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
              <div><span className="font-medium text-gray-900">{deal.partner}</span> - {deal.content}</div>
              <span className={`px-2 py-0.5 text-xs rounded-full ${deal.license === 'Exclusive' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>{deal.license}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

