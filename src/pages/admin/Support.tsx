import { useState } from 'react';
import { mockTickets } from '@/lib/data';

export default function AdminSupportPage() {
  const [filter, setFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [tickets, setTickets] = useState(mockTickets);

  const priorityColors: Record<string, string> = { low: 'bg-gray-100 text-gray-600', medium: 'bg-yellow-100 text-yellow-700', high: 'bg-orange-100 text-orange-700', critical: 'bg-red-100 text-red-700' };
  const statusColors: Record<string, string> = { open: 'bg-blue-100 text-blue-700', in_progress: 'bg-yellow-100 text-yellow-700', resolved: 'bg-green-100 text-green-700', closed: 'bg-gray-100 text-gray-600' };
  const categoryColors: Record<string, string> = { payment: 'bg-green-50 text-green-700', content: 'bg-blue-50 text-blue-700', technical: 'bg-purple-50 text-purple-700', dispute: 'bg-red-50 text-red-700', other: 'bg-gray-50 text-gray-700' };

  const filtered = filter === 'all' ? tickets : tickets.filter(t => t.status === filter);

  const updateStatus = (id: string, status: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: status as typeof t.status, updatedAt: '2026-02-08' } : t));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Support & Dispute Resolution</h1>
      <p className="mt-1 text-gray-500">Manage support tickets and resolve disputes</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <div className="text-sm text-gray-500">Open Tickets</div>
          <div className="text-2xl font-bold text-blue-600">{tickets.filter(t => t.status === 'open').length}</div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="text-sm text-gray-500">In Progress</div>
          <div className="text-2xl font-bold text-yellow-600">{tickets.filter(t => t.status === 'in_progress').length}</div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="text-sm text-gray-500">Resolved (Month)</div>
          <div className="text-2xl font-bold text-green-600">{tickets.filter(t => t.status === 'resolved').length}</div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="text-sm text-gray-500">Avg Resolution Time</div>
          <div className="text-2xl font-bold text-gray-900">2.3 days</div>
        </div>
      </div>

      <div className="mt-6 flex gap-2 flex-wrap">
        {['all', 'open', 'in_progress', 'resolved', 'closed'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === s ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}>
            {s === 'all' ? 'All' : s.replace(/_/g, ' ')} {s !== 'all' ? `(${tickets.filter(t => t.status === s).length})` : ''}
          </button>
        ))}
      </div>

      <div className="mt-6 bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left text-gray-500">
              <th className="p-3">Subject</th>
              <th className="p-3">Raised By</th>
              <th className="p-3">Category</th>
              <th className="p-3">Priority</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(ticket => (
              <tr key={ticket.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-3 font-medium text-gray-900 max-w-[200px]">{ticket.subject}</td>
                <td className="p-3 text-gray-500">{ticket.raisedBy}</td>
                <td className="p-3"><span className={`px-2 py-0.5 text-xs rounded-full ${categoryColors[ticket.category]}`}>{ticket.category}</span></td>
                <td className="p-3"><span className={`px-2 py-0.5 text-xs rounded-full font-medium ${priorityColors[ticket.priority]}`}>{ticket.priority}</span></td>
                <td className="p-3"><span className={`px-2 py-0.5 text-xs rounded-full ${statusColors[ticket.status]}`}>{ticket.status.replace(/_/g, ' ')}</span></td>
                <td className="p-3 text-gray-500">{ticket.createdAt}</td>
                <td className="p-3"><button onClick={() => setSelectedTicket(ticket.id)} className="text-xs text-indigo-600 hover:text-indigo-700">View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <h3 className="font-semibold text-gray-900 mb-4">Escalated Issues (High/Critical Priority)</h3>
        <div className="space-y-3">
          {tickets.filter(t => (t.priority === 'high' || t.priority === 'critical') && t.status !== 'resolved' && t.status !== 'closed').map(ticket => (
            <div key={ticket.id} className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${priorityColors[ticket.priority]}`}>{ticket.priority}</span>
                  <h4 className="font-medium text-gray-900">{ticket.subject}</h4>
                </div>
                <p className="text-sm text-gray-500 mt-1">Raised by {ticket.raisedBy} | {ticket.category} | {ticket.createdAt}</p>
              </div>
              <button onClick={() => setSelectedTicket(ticket.id)} className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">Resolve Now</button>
            </div>
          ))}
        </div>
      </div>

      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedTicket(null)}>
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {(() => {
              const ticket = tickets.find(t => t.id === selectedTicket);
              if (!ticket) return null;
              return (
                <>
                  <h3 className="text-lg font-semibold">{ticket.subject}</h3>
                  <div className="mt-2 flex gap-2">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${priorityColors[ticket.priority]}`}>{ticket.priority}</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${statusColors[ticket.status]}`}>{ticket.status.replace(/_/g, ' ')}</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${categoryColors[ticket.category]}`}>{ticket.category}</span>
                  </div>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{ticket.description}</p>
                    <div className="mt-2 text-xs text-gray-400">Raised by {ticket.raisedBy} on {ticket.createdAt}</div>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Conversation</h4>
                    <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                      <div className="bg-white p-2 rounded text-sm"><span className="font-medium">{ticket.raisedBy}:</span> {ticket.description}</div>
                      <div className="bg-indigo-50 p-2 rounded text-sm"><span className="font-medium">Support:</span> We are looking into this issue. Will update you shortly.</div>
                    </div>
                    <textarea className="w-full border rounded-lg px-3 py-2 text-sm mt-2" rows={2} placeholder="Type a response..."></textarea>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <select className="border rounded-lg px-3 py-2 text-sm" value={ticket.status} onChange={e => updateStatus(ticket.id, e.target.value)}>
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                    <button onClick={() => setSelectedTicket(null)} className="px-4 py-2 border rounded-lg text-sm">Close</button>
                    <button onClick={() => { updateStatus(ticket.id, 'resolved'); setSelectedTicket(null); }} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">Mark Resolved</button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

