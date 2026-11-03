import { useState, useMemo } from 'react';
import { mockResources } from '@/lib/data';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';

type ResourceType = 'all' | 'pdf' | 'ebook' | 'magazine' | 'notes' | 'video';

export default function ResourcesPage() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.session?.user);
  const [activeType, setActiveType] = useState<ResourceType>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const allSubjects = useMemo(() => {
    const subjects = new Set<string>();
    mockResources.forEach((r) => subjects.add(r.subject));
    return Array.from(subjects).sort();
  }, []);

  const filteredResources = useMemo(() => {
    let resources = [...mockResources];

    if (activeType !== 'all') {
      resources = resources.filter((r) => r.type === activeType);
    }
    if (subjectFilter !== 'all') {
      resources = resources.filter((r) => r.subject === subjectFilter);
    }
    if (priceFilter === 'free') {
      resources = resources.filter((r) => r.free);
    } else if (priceFilter === 'paid') {
      resources = resources.filter((r) => !r.free);
    }

    return resources;
  }, [activeType, subjectFilter, priceFilter]);

  const typeIcons: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
    pdf: {
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      color: 'text-red-600',
      bg: 'bg-red-100',
    },
    ebook: {
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    magazine: {
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
    notes: {
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    video: {
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      color: 'text-orange-600',
      bg: 'bg-orange-100',
    },
  };

  const typeTabs: { value: ResourceType; label: string }[] = [
    { value: 'all', label: 'All Resources' },
    { value: 'pdf', label: 'PDFs' },
    { value: 'ebook', label: 'E-Books' },
    { value: 'magazine', label: 'Magazines' },
    { value: 'notes', label: 'Notes' },
    { value: 'video', label: 'Videos' },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">Resource library</p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-gray-900">Study Resources</h1>
          <p className="mt-0.5 text-sm text-gray-500">Materials from trusted UPSC educators and publishers.</p>
        </div>
        <div className="flex shrink-0 items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          <button
            onClick={() => setViewMode('grid')}
            className={`rounded-md p-2 transition-colors ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`rounded-md p-2 transition-colors ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Type Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
        <div className="flex flex-wrap gap-2">
        {typeTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveType(tab.value)}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${
              activeType === tab.value
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-slate-50 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100">
            <option value="all">All Subjects</option>{allSubjects.map((sub) => <option key={sub} value={sub}>{sub}</option>)}
          </select>
          <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100">
            <option value="all">All (Free & Paid)</option><option value="free">Free Only</option><option value="paid">Paid Only</option>
          </select>
          <span className="text-xs text-gray-500">{filteredResources.length} found</span>
        </div>
      </div>

      {/* Filters Row */}
      <div className="hidden">
        <select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        >
          <option value="all">All Subjects</option>
          {allSubjects.map((sub) => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </select>
        <select
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        >
          <option value="all">All (Free & Paid)</option>
          <option value="free">Free Only</option>
          <option value="paid">Paid Only</option>
        </select>
        <span className="text-sm text-gray-500 sm:ml-auto">{filteredResources.length} resources found</span>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="flex flex-wrap gap-4">
          {filteredResources.map((resource) => {
            const typeInfo = typeIcons[resource.type];
            return (
              <div key={resource.id} className="group flex w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg sm:w-[17rem]">
                <div className={`flex items-center justify-center py-4 ${typeInfo.bg}`}>
                  <div className={`${typeInfo.color}`}>
                    <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {resource.type === 'pdf' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />}
                      {resource.type === 'ebook' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />}
                      {resource.type === 'magazine' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />}
                      {resource.type === 'notes' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />}
                      {resource.type === 'video' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />}
                    </svg>
                  </div>
                </div>
                <div className="flex flex-col p-3.5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${typeInfo.bg} ${typeInfo.color}`}>
                      {resource.type.toUpperCase()}
                    </span>
                    {resource.free && (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        FREE
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold leading-5 text-gray-900 line-clamp-2 transition-colors group-hover:text-indigo-600">{resource.title}</h3>
                  <p className="mt-1 text-xs text-gray-500">{resource.provider}</p>
                  <p className="mt-1 text-xs text-gray-400">{resource.subject} | {resource.language}</p>
                  {resource.pages && (
                    <p className="mt-1 text-xs text-gray-400">{resource.pages} pages {resource.fileSize ? `| ${resource.fileSize}` : ''}</p>
                  )}
                  <div className="mt-4 flex items-center justify-between">
                    {resource.free ? (
                      <span className="text-lg font-bold text-green-600">Free</span>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">&#8377;{resource.price}</span>
                    )}
                    <button onClick={() => !user && navigate('/login')} className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      resource.free
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}>
                      {resource.free ? 'Download' : 'Buy Now'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {filteredResources.map((resource) => {
            const typeInfo = typeIcons[resource.type];
            return (
              <div key={resource.id} className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center">
                <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl ${typeInfo.bg}`}>
                  <div className={typeInfo.color}>{typeInfo.icon}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 truncate">{resource.title}</h3>
                    {resource.free && (
                      <span className="flex-shrink-0 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        FREE
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                    <span>{resource.provider}</span>
                    <span className="text-gray-300">|</span>
                    <span>{resource.subject}</span>
                    <span className="text-gray-300">|</span>
                    <span className={`${typeInfo.color} font-medium`}>{resource.type.toUpperCase()}</span>
                    {resource.pages && (
                      <>
                        <span className="text-gray-300">|</span>
                        <span>{resource.pages} pages</span>
                      </>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-400 line-clamp-1">{resource.description}</p>
                </div>
                <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:flex-shrink-0">
                  {resource.free ? (
                    <span className="text-lg font-bold text-green-600">Free</span>
                  ) : (
                    <span className="text-lg font-bold text-gray-900">&#8377;{resource.price}</span>
                  )}
                  <button onClick={() => !user && navigate('/login')} className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    resource.free
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}>
                    {resource.free ? 'Download' : 'Buy Now'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filteredResources.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-16">
          <svg className="h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="mt-4 text-lg font-medium text-gray-500">No resources found</p>
          <p className="mt-1 text-sm text-gray-400">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}

