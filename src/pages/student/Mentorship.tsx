import { useState } from 'react';
import { mockMentors } from '@/lib/data';

export default function MentorshipPage() {
  const [filter, setFilter] = useState('all');
  const [bookingMentor, setBookingMentor] = useState<string | null>(null);
  const mentors = filter === 'all' ? mockMentors : mockMentors.filter(m => m.specialization.some(s => s.toLowerCase().includes(filter.toLowerCase())));
  const categories = ['all', 'Prelims', 'Mains', 'Interview', 'Optional', 'Essay'];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Find a Mentor</h1>
      <p className="mt-1 text-gray-500">Get personalized guidance from UPSC toppers and experienced mentors</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === cat ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}>
            {cat === 'all' ? 'All Mentors' : cat}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {mentors.map(mentor => (
          <div key={mentor.id} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-indigo-600 font-bold text-xl">{mentor.name.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{mentor.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{mentor.bio}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {mentor.specialization.map(s => (
                    <span key={s} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                  <div><span className="text-gray-400">Rating</span><div className="font-semibold flex items-center gap-1"><span className="text-yellow-500">★</span>{mentor.rating}</div></div>
                  <div><span className="text-gray-400">Sessions</span><div className="font-semibold">{mentor.sessionsCompleted}</div></div>
                  <div><span className="text-gray-400">Experience</span><div className="font-semibold">{mentor.experience} yrs</div></div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Available: {mentor.availability.join(', ')} | Languages: {mentor.languages.join(', ')}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">₹{mentor.pricePerSession}/session</span>
                  <button onClick={() => setBookingMentor(mentor.id)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
                    Book Session
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {bookingMentor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setBookingMentor(null)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold">Book Mentorship Session</h3>
            <p className="text-sm text-gray-500 mt-1">with {mockMentors.find(m => m.id === bookingMentor)?.name}</p>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm">
                  <option>10:00 AM - 11:00 AM</option>
                  <option>2:00 PM - 3:00 PM</option>
                  <option>5:00 PM - 6:00 PM</option>
                  <option>7:00 PM - 8:00 PM</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Topics to Discuss</label>
                <textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={3} placeholder="Briefly describe what you want to discuss..."></textarea>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-bold">₹{mockMentors.find(m => m.id === bookingMentor)?.pricePerSession}</span>
                <div className="flex gap-2">
                  <button onClick={() => setBookingMentor(null)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
                  <button onClick={() => { alert('Session booked successfully!'); setBookingMentor(null); }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">Confirm Booking</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

