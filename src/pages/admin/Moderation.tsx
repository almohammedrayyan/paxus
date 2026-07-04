import { useState } from 'react';
import { mockSubmissions } from '@/lib/data';

export default function AdminModerationPage() {
  const [tab, setTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState(mockSubmissions);
  const filtered = submissions.filter(s => s.status === tab);
  const typeColors: Record<string, string> = { course: 'bg-blue-100 text-blue-700', test_series: 'bg-green-100 text-green-700', resource: 'bg-purple-100 text-purple-700' };
  const submitterColors: Record<string, string> = { institute: 'bg-indigo-100 text-indigo-700', educator: 'bg-orange-100 text-orange-700', publisher: 'bg-teal-100 text-teal-700' };

  const handleAction = (id: string, action: 'approved' | 'rejected') => {
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: action, reviewedAt: '2026-02-08', reviewNotes: action === 'approved' ? 'Approved by admin.' : 'Does not meet quality standards.' } : s));
    setReviewingId(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Content Moderation</h1>
      <p className="mt-1 text-gray-500">Review and approve content submissions from providers</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <div className="text-sm text-gray-500">Pending Review</div>
          <div className="text-2xl font-bold text-orange-600">{submissions.filter(s => s.status === 'pending').length}</div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="text-sm text-gray-500">Approved This Month</div>
          <div className="text-2xl font-bold text-green-600">{submissions.filter(s => s.status === 'approved').length}</div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="text-sm text-gray-500">Rejection Rate</div>
          <div className="text-2xl font-bold text-gray-900">8%</div>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        {(['pending', 'approved', 'rejected'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${tab === t ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}>
            {t} ({submissions.filter(s => s.status === t).length})
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {filtered.map(sub => (
          <div key={sub.id} className="bg-white rounded-xl border p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${typeColors[sub.type]}`}>{sub.type.replace('_', ' ')}</span>
                  <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${submitterColors[sub.submitterType]}`}>{sub.submitterType}</span>
                </div>
                <h3 className="font-semibold text-gray-900">{sub.title}</h3>
                <div className="text-sm text-gray-500 mt-1">Submitted by {sub.submittedBy} on {sub.submittedAt}</div>
                {sub.reviewNotes && <div className="text-sm text-gray-600 mt-2 italic">Note: {sub.reviewNotes}</div>}
              </div>
              <div className="flex gap-2">
                {sub.status === 'pending' && (
                  <>
                    <button onClick={() => setReviewingId(sub.id)} className="px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50">Review</button>
                    <button onClick={() => handleAction(sub.id, 'approved')} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">Approve</button>
                    <button onClick={() => handleAction(sub.id, 'rejected')} className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">Reject</button>
                  </>
                )}
                {sub.status !== 'pending' && (
                  <span className={`px-3 py-1.5 rounded-lg text-sm ${sub.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {sub.status} {sub.reviewedAt && `on ${sub.reviewedAt}`}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="bg-white rounded-xl border p-8 text-center text-gray-400">No {tab} submissions</div>}
      </div>

      {reviewingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setReviewingId(null)}>
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold">Review Submission</h3>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="font-medium">{submissions.find(s => s.id === reviewingId)?.title}</p>
              <p className="text-sm text-gray-500 mt-1">Type: {submissions.find(s => s.id === reviewingId)?.type}</p>
              <p className="text-sm text-gray-500">By: {submissions.find(s => s.id === reviewingId)?.submittedBy}</p>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Review Notes</label>
              <textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={3} placeholder="Add notes about this submission..."></textarea>
            </div>
            <div className="mt-4 flex gap-2 justify-end">
              <button onClick={() => setReviewingId(null)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
              <button onClick={() => handleAction(reviewingId, 'rejected')} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm">Reject</button>
              <button onClick={() => handleAction(reviewingId, 'approved')} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">Approve</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

