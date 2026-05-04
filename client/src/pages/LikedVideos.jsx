import React from 'react';
import { Heart, Play, ListFilter } from 'lucide-react';
import { motion } from 'framer-motion';
import VideoCard from '../components/common/VideoCard';

const MOCK_LIKED = [
  {
    id: 'l-1',
    title: 'How to use the UniCast Platform',
    thumbnail: 'https://images.pexels.com/photos/1181335/pexels-photo-1181335.jpeg?auto=compress&cs=tinysrgb&w=640',
    views: 5200,
    creator: { id: 'admin', fullName: 'UniCast Team' },
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    duration: 320
  },
  {
    id: 'l-2',
    title: 'Campus Tour: New Engineering Block',
    thumbnail: 'https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=640',
    views: 12400,
    creator: { id: 'user-2', fullName: 'Events Club' },
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    duration: 840
  },
  {
    id: 'l-3',
    title: 'Python for Beginners Workshop',
    thumbnail: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=640',
    views: 8900,
    creator: { id: 'user-4', fullName: 'CSE Dept' },
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    duration: 5400
  }
];

const LikedVideos = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="page-pad">
      <div className="watch-later-layout" style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: 40 }}>
        {/* Left Sidebar Info */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ 
            background: 'linear-gradient(180deg, var(--gray-100) 0%, var(--white) 100%)',
            padding: 32,
            border: '1px solid var(--border)',
            height: 'fit-content',
            position: 'sticky',
            top: 100
          }}
        >
          <div style={{ 
            width: '100%', 
            aspectRatio: '16/9', 
            background: 'var(--gray-900)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: 24
          }}>
            <Heart size={48} color="white" fill="white" />
          </div>
          
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Liked Videos</h1>
          
          <div style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 24 }}>
            <span>{MOCK_LIKED.length} videos</span>
            <span style={{ margin: '0 8px' }}>·</span>
            <span>Updated today</span>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn--primary btn--full">
              <Play size={16} fill="white" /> Play All
            </button>
          </div>
        </motion.div>

        {/* Right Content List */}
        <div>
          <div className="section-header" style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ListFilter size={16} color="var(--gray-400)" />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-600)' }}>Sort by: Recently Liked</span>
            </div>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            {MOCK_LIKED.map((v, i) => (
              <motion.div 
                key={v.id} 
                variants={itemVariants}
                style={{ 
                  display: 'flex', 
                  gap: 16, 
                  padding: 12, 
                  border: '1px solid transparent',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
              >
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-400)', width: 20, display: 'flex', alignItems: 'center' }}>
                  {i + 1}
                </div>
                <div style={{ width: 160, aspectRatio: '16/9', flexShrink: 0 }}>
                  <img src={v.thumbnail} alt={v.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{v.title}</h3>
                  <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>
                    {v.creator.fullName} · {v.views} views
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .watch-later-layout { grid-template-columns: 1fr !important; }
          .watch-later-layout > div:first-child { position: static !important; width: 100% !important; }
        }
      `}</style>
    </div>
  );
};

export default LikedVideos;
