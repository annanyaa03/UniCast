import React from 'react';
import { Timer, Play, ListFilter, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_SAVED = [
  {
    id: 'w-1',
    title: 'Data Structures and Algorithms Complete Course',
    thumbnail: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=640',
    views: '45K',
    creator: { id: 'user-4', fullName: 'CSE Dept' },
    createdAt: '2 days ago',
    duration: '5:40:00'
  },
  {
    id: 'w-2',
    title: 'Digital Marketing Workshop for Students',
    thumbnail: 'https://images.pexels.com/photos/1701202/pexels-photo-1701202.jpeg?auto=compress&cs=tinysrgb&w=640',
    views: '1.2K',
    creator: { id: 'user-2', fullName: 'Events Club' },
    createdAt: '1 week ago',
    duration: '1:15:20'
  }
];

const WatchLater = () => {
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
            <Timer size={48} color="white" />
          </div>
          
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Watch Later</h1>
          
          <div style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 24 }}>
            <span>{MOCK_SAVED.length} videos</span>
            <span style={{ margin: '0 8px' }}>·</span>
            <span>Private</span>
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
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-600)' }}>Sort by: Date added (newest)</span>
            </div>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            {MOCK_SAVED.length > 0 ? (
              MOCK_SAVED.map((v, i) => (
                <motion.div 
                  key={v.id} 
                  variants={itemVariants}
                  style={{ 
                    display: 'flex', 
                    gap: 16, 
                    padding: 12, 
                    border: '1px solid transparent',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.querySelector('.delete-btn').style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.querySelector('.delete-btn').style.opacity = '0';
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-400)', width: 20, display: 'flex', alignItems: 'center' }}>
                    {i + 1}
                  </div>
                  <div style={{ width: 160, aspectRatio: '16/9', flexShrink: 0, position: 'relative' }}>
                    <img src={v.thumbnail} alt={v.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: 4, right: 4, background: 'rgba(0,0,0,0.8)', color: 'white', fontSize: 10, padding: '1px 4px' }}>
                      {v.duration}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{v.title}</h3>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>
                      {v.creator.fullName} · {v.views} views · {v.createdAt}
                    </div>
                  </div>
                  <button 
                    className="delete-btn" 
                    style={{ 
                      opacity: 0, 
                      transition: 'opacity 0.2s',
                      color: 'var(--gray-400)',
                      padding: 8
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-state__icon"><Timer size={40} /></div>
                <div className="empty-state__title">Your Watch Later list is empty</div>
                <div className="empty-state__desc">Save videos to watch them later.</div>
              </div>
            )}
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

export default WatchLater;
