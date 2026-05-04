import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Flame, TrendingUp, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchTrending } from '../store/slices/videoSlice';
import VideoCard, { VideoCardSkeleton } from '../components/common/VideoCard';

const Trending = () => {
  const dispatch = useDispatch();
  const { trending, feedLoading } = useSelector((s) => s.video);

  useEffect(() => {
    dispatch(fetchTrending());
  }, [dispatch]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="page-pad">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="section-header"
        style={{ marginBottom: 40, borderBottom: '1px solid var(--border)', paddingBottom: 24 }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ 
              width: 40, 
              height: 40, 
              background: 'var(--gray-900)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Flame size={20} color="white" />
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em' }}>Trending</h1>
          </div>
          <p style={{ color: 'var(--gray-500)', fontSize: 14 }}>
            The most popular videos on UniCast right now.
          </p>
        </div>
        
        <button className="btn btn--outline btn--sm" style={{ alignSelf: 'flex-end' }}>
          <Filter size={14} /> Filter
        </button>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="video-grid"
      >
        {feedLoading ? (
          Array.from({ length: 8 }).map((_, i) => <VideoCardSkeleton key={i} />)
        ) : trending.length > 0 ? (
          trending.map((v) => (
            <motion.div key={v.id} variants={itemVariants}>
              <VideoCard video={v} />
            </motion.div>
          ))
        ) : (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <div className="empty-state__icon"><TrendingUp size={40} /></div>
            <div className="empty-state__title">Nothing trending right now</div>
            <div className="empty-state__desc">Check back later for popular content.</div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Trending;
