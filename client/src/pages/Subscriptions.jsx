import React, { useState } from 'react';
import { Users, LayoutGrid, List, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import VideoCard from '../components/common/VideoCard';

const MOCK_SUBS = [
  { id: 'user-1', fullName: 'Prof. Sharma', username: 'prof_sharma', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'user-2', fullName: 'Events Club', username: 'events_unicast', avatar: 'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'user-3', fullName: 'Robotics Club', username: 'robotics_iit', avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'user-4', fullName: 'CSE Dept', username: 'cse_official', avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150' },
];

const MOCK_VIDEOS = [
  {
    id: 's-1',
    title: 'Advanced Machine Learning Lecture 12',
    thumbnail: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=640',
    views: 1200,
    creator: MOCK_SUBS[3],
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    duration: 3600
  },
  {
    id: 's-2',
    title: 'Robot War: Semi Finals',
    thumbnail: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=640',
    views: 4500,
    creator: MOCK_SUBS[2],
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    duration: 1200
  },
  {
    id: 's-3',
    title: 'Freshers Party 2024 Aftermovie',
    thumbnail: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=640',
    views: 8900,
    creator: MOCK_SUBS[1],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    duration: 450
  }
];

const Subscriptions = () => {
  const [view, setView] = useState('grid');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
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
              <Users size={20} color="white" />
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em' }}>Subscriptions</h1>
          </div>
          <p style={{ color: 'var(--gray-500)', fontSize: 14 }}>
            Latest content from the channels you follow.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button 
            className={`btn btn--outline btn--sm ${view === 'grid' ? 'active' : ''}`}
            onClick={() => setView('grid')}
            style={{ padding: '8px' }}
          >
            <LayoutGrid size={16} />
          </button>
          <button 
            className={`btn btn--outline btn--sm ${view === 'list' ? 'active' : ''}`}
            onClick={() => setView('list')}
            style={{ padding: '8px' }}
          >
            <List size={16} />
          </button>
        </div>
      </motion.div>

      {/* Subscriptions Bar */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ 
          display: 'flex', 
          gap: 20, 
          marginBottom: 40, 
          overflowX: 'auto', 
          paddingBottom: 16,
          borderBottom: '1px solid var(--gray-100)'
        }}
      >
        {MOCK_SUBS.map((sub) => (
          <div key={sub.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer', flexShrink: 0 }}>
            <div style={{ width: 60, height: 60, overflow: 'hidden', border: '1px solid var(--border)' }}>
              <img src={sub.avatar} alt={sub.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-700)', maxWidth: 80, textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {sub.fullName}
            </span>
          </div>
        ))}
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={view === 'grid' ? 'video-grid' : 'video-list'}
        style={view === 'list' ? { display: 'flex', flexDirection: 'column', gap: 16 } : {}}
      >
        {MOCK_VIDEOS.map((v) => (
          <motion.div key={v.id} variants={itemVariants}>
            <VideoCard video={v} compact={view === 'list'} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Subscriptions;
