import { useState } from 'react';
import { mockForumPosts } from '@/lib/data';

export default function CommunityPage() {
  const [category, setCategory] = useState('All');
  const [showNewPost, setShowNewPost] = useState(false);
  const categories = ['All', 'Strategy', 'Resources', 'Optional', 'Current Affairs', 'Motivation'];
  const filtered = category === 'All' ? mockForumPosts : mockForumPosts.filter(p => p.category === category);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Community Forums</h1>
          <p className="mt-1 text-gray-500">Discuss, share, and learn with fellow aspirants</p>
        </div>
        <button onClick={() => setShowNewPost(!showNewPost)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
          + New Post
        </button>
      </div>

      {showNewPost && (
        <div className="mt-4 bg-white rounded-xl border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Create New Post</h3>
          <div className="space-y-3">
            <input type="text" placeholder="Post title..." className="w-full border rounded-lg px-3 py-2 text-sm" />
            <textarea placeholder="Write your post content..." className="w-full border rounded-lg px-3 py-2 text-sm" rows={4}></textarea>
            <div className="flex gap-3">
              <select className="border rounded-lg px-3 py-2 text-sm">
                {categories.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
              </select>
              <input type="text" placeholder="Tags (comma-separated)" className="flex-1 border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowNewPost(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
              <button onClick={() => { alert('Post created!'); setShowNewPost(false); }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">Publish</button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-2 rounded-lg text-sm font-medium ${category === cat ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {filtered.map(post => (
          <div key={post.id} className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 text-xs rounded-full bg-indigo-50 text-indigo-600 font-medium">{post.category}</span>
                  {post.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-500">#{tag}</span>
                  ))}
                </div>
                <h3 className="font-semibold text-gray-900">{post.title}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{post.content}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-4 text-sm text-gray-400">
              <span>by <span className="text-gray-600 font-medium">{post.author}</span></span>
              <span>{post.date}</span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                {post.replies} replies
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                {post.likes} likes
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

