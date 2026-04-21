import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SlidersHorizontal, Search as SearchIcon, Users, Calendar, Play } from 'lucide-react';
import { fetchFeed, resetFeed } from '../store/slices/videoSlice';
import VideoCard, { VideoCardSkeleton } from '../components/common/VideoCard';
import useInfiniteScroll from '../hooks/useInfiniteScroll';

const FILTERS = [
  { id: 'all', label: 'All', icon: <SearchIcon size={14} /> },
  { id: 'videos', label: 'Videos', icon: <Play size={14} /> },
  { id: 'clubs', label: 'Clubs', icon: <Users size={14} /> },
  { id: 'events', label: 'Events', icon: <Calendar size={14} /> },
];

const CATEGORIES = ['Education', 'Cultural', 'Sports', 'Technical', 'General'];

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const initialFilter = searchParams.get('filter') || 'all';

  const dispatch = useDispatch();
  const { feed, feedLoading, hasMore, page } = useSelector((state) => state.video);

  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    dispatch(resetFeed());
    dispatch(fetchFeed({
      q: query,
      filter: activeFilter,
      category: selectedCategory === 'All' ? '' : selectedCategory.toLowerCase(),
      page: 1
    }));
  }, [query, activeFilter, selectedCategory, dispatch]);

  const loadMore = () => {
    if (!feedLoading && hasMore) {
      dispatch(fetchFeed({
        q: query,
        filter: activeFilter,
        category: selectedCategory === 'All' ? '' : selectedCategory.toLowerCase(),
        page
      }));
    }
  };

  const lastRef = useInfiniteScroll(loadMore, hasMore, feedLoading);

  return (
    <div className="page-pad">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 className="section-title" style={{ fontSize: '20px' }}>
          {query ? `Search results for "${query}"` : 'Discover'}
        </h1>
        <button
          className={`btn ${showFilters ? 'btn--primary' : 'btn--outline'} btn--sm`}
          onClick={() => setShowFilters(!showFilters)}
          style={{ gap: '8px' }}
        >
          <SlidersHorizontal size={14} /> Filters
        </button>
      </div>

      {showFilters && (
        <div style={{ padding: '20px', border: '1px solid var(--border)', background: 'var(--gray-50)', marginBottom: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px' }}>
          <div>
            <p className="form-label" style={{ marginBottom: '12px' }}>Type</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {FILTERS.map(f => (
                <button
                  key={f.id}
                  className={`btn btn--sm ${activeFilter === f.id ? 'btn--primary' : 'btn--ghost'}`}
                  style={{ justifyContent: 'flex-start', gap: '10px' }}
                  onClick={() => setActiveFilter(f.id)}
                >
                  {f.icon} {f.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="form-label" style={{ marginBottom: '12px' }}>Category</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['All', ...CATEGORIES].map(cat => (
                <button
                  key={cat}
                  className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="form-label" style={{ marginBottom: '12px' }}>Upload Date</p>
            <select className="form-select" style={{ height: '32px', fontSize: '13px' }}>
              <option>Anytime</option>
              <option>Last hour</option>
              <option>Today</option>
              <option>This week</option>
              <option>This month</option>
              <option>This year</option>
            </select>
          </div>
          <div>
            <p className="form-label" style={{ marginBottom: '12px' }}>Sort By</p>
            <select className="form-select" style={{ height: '32px', fontSize: '13px' }}>
              <option>Relevance</option>
              <option>Upload date</option>
              <option>View count</option>
              <option>Rating</option>
            </select>
          </div>
        </div>
      )}

      {activeFilter === 'all' || activeFilter === 'videos' ? (
        <div className="video-grid">
          {feed.map((v, i) => (
            <div key={v.id} ref={i === feed.length - 1 ? lastRef : null}>
              <VideoCard video={v} />
            </div>
          ))}
          {feedLoading && Array.from({ length: 8 }).map((_, i) => <VideoCardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="empty-state">
          <SearchIcon size={48} className="empty-state__icon" />
          <h2 className="empty-state__title">No {activeFilter} found</h2>
          <p className="empty-state__desc">Try adjusting your filters or searching for something else.</p>
        </div>
      )}

      {!feedLoading && feed.length === 0 && (
        <div className="empty-state">
          <SearchIcon size={48} className="empty-state__icon" />
          <h2 className="empty-state__title">No results found</h2>
          <p className="empty-state__desc">Try different keywords or check your spelling.</p>
        </div>
      )}
    </div>
  );
};

export default Search;
