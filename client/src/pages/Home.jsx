import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { TrendingUp, ArrowRight, Play, ChevronRight } from 'lucide-react';
import { fetchFeed, fetchTrending, resetFeed } from '../store/slices/videoSlice';
import VideoCard, { VideoCardSkeleton } from '../components/common/VideoCard';
import useInfiniteScroll from '../hooks/useInfiniteScroll';

const CATEGORIES = ['All', 'Education', 'Cultural', 'Sports', 'Technical', 'Events', 'Clubs', 'Shorts'];

const MOCK_HERO = {
  id: 'hero-1',
  title: 'Annual Technical Fest 2024 — Opening Ceremony',
  thumbnail: 'https://picsum.photos/seed/hero1/1200/500',
  views: 18400,
  creator: { fullName: 'Events Committee', id: 'ec-1' },
  createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
};

const Home = () => {
  const dispatch = useDispatch();
  const { feed, trending, feedLoading, hasMore, page } = useSelector((s) => s.video);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    dispatch(resetFeed());
    dispatch(fetchTrending());
    dispatch(fetchFeed({ category: activeCategory === 'All' ? '' : activeCategory.toLowerCase(), page: 1 }));
  }, [activeCategory, dispatch]);

  const loadMore = useCallback(() => {
    if (!feedLoading && hasMore) dispatch(fetchFeed({ page, category: activeCategory === 'All' ? '' : activeCategory.toLowerCase() }));
  }, [dispatch, feedLoading, hasMore, page, activeCategory]);

  const lastRef = useInfiniteScroll(loadMore, hasMore, feedLoading);

  return (
    <div>
      {/* Hero Banner */}
      <div className="hero-banner">
        <img src={MOCK_HERO.thumbnail} alt={MOCK_HERO.title} />
        <div className="hero-banner__overlay">
          <div className="hero-banner__content">
            <div className="hero-banner__label">Featured</div>
            <h1 className="hero-banner__title">{MOCK_HERO.title}</h1>
            <div className="hero-banner__meta">
              {MOCK_HERO.creator.fullName} · 18.4K views
            </div>
            <Link to={`/watch/${MOCK_HERO.id}`} className="btn btn--primary">
              <Play size={15} fill="currentColor" /> Watch Now
            </Link>
          </div>
        </div>
      </div>

      <div className="page-pad">
        {/* Trending Section */}
        {trending.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <div className="section-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <TrendingUp size={17} />
                <span className="section-title">Trending Now</span>
              </div>
              <Link to="/search?filter=trending" className="section-link" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                See all <ArrowRight size={13} />
              </Link>
            </div>
            <div className="video-grid">
              {trending.slice(0, 4).map((v) => <VideoCard key={v.id} video={v} />)}
            </div>
          </section>
        )}

        {/* Category Filter */}
        <div className="category-bar" style={{ marginBottom: 24 }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`category-chip ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Main Feed */}
        <section>
          <div className="section-header">
            <span className="section-title">
              {activeCategory === 'All' ? 'All Videos' : activeCategory}
            </span>
          </div>

          <div className="video-grid">
            {feed.map((v, i) => {
              const isLast = i === feed.length - 1;
              return (
                <div key={v.id} ref={isLast ? lastRef : null}>
                  <VideoCard video={v} />
                </div>
              );
            })}
            {feedLoading && Array.from({ length: 8 }).map((_, i) => <VideoCardSkeleton key={i} />)}
          </div>

          {!feedLoading && feed.length === 0 && (
            <div className="empty-state">
              <div className="empty-state__icon"><Play size={40} /></div>
              <div className="empty-state__title">No videos yet</div>
              <div className="empty-state__desc">Be the first to upload content in this category.</div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
