import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Search as SearchIcon, Trash2, MoreVertical, PlayCircle } from 'lucide-react';
import VideoCard from '../components/common/VideoCard';
import { formatDate } from '../utils/formatters';

const MOCK_HISTORY = [
  { id: 'v1', title: 'Intro to Data Structures', views: 1240, createdAt: '2024-04-20T10:00:00', creator: { fullName: 'Prof. Sharma', id: 'p1' }, thumbnail: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=640', watchedAt: '2024-04-21T21:30:00' },
  { id: 'v2', title: 'React Hooks Explained', views: 5600, createdAt: '2024-04-18T14:30:00', creator: { fullName: 'Tech Society', id: 't1' }, thumbnail: 'https://images.pexels.com/photos/1181335/pexels-photo-1181335.jpeg?auto=compress&cs=tinysrgb&w=640', watchedAt: '2024-04-21T18:15:00' },
  { id: 'v3', title: 'Campus Night 2024', views: 890, createdAt: '2024-03-22T09:15:00', creator: { fullName: 'Cultural Council', id: 'c1' }, thumbnail: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=640', watchedAt: '2024-04-20T23:00:00' },
  { id: 'v4', title: 'Robotics Demo', views: 420, createdAt: '2024-02-15T11:00:00', creator: { fullName: 'Robotics Club', id: 'r1' }, thumbnail: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=640', watchedAt: '2024-04-20T14:45:00' },
];

const History = () => {
  const [history, setHistory] = useState(MOCK_HISTORY);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = history.filter(v => 
    v.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear your entire watch history?')) {
      setHistory([]);
    }
  };

  const removeFromHistory = (id) => {
    setHistory(prev => prev.filter(v => v.id !== id));
  };

  return (
    <div className="page-pad">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 className="auth-title" style={{ marginBottom: '8px' }}>Watch History</h1>
          <p className="auth-subtitle" style={{ marginBottom: 0 }}>Review the videos you've watched recently.</p>
        </div>
        <button className="btn btn--outline" onClick={clearHistory} style={{ gap: '8px', color: 'var(--red)', borderColor: 'var(--red-light)' }}>
          <Trash2 size={16} /> Clear History
        </button>
      </div>

      <div className="search-bar" style={{ maxWidth: '400px', marginBottom: '32px' }}>
        <div className="search-bar__wrap">
          <span className="search-bar__icon"><SearchIcon size={14} /></span>
          <input 
            className="search-bar__input" 
            type="text" 
            placeholder="Search your history..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
         {filteredHistory.length > 0 ? (
           filteredHistory.map((video) => (
             <div key={video.id + video.watchedAt} style={{ display: 'grid', gridTemplateColumns: '240px 1fr 40px', gap: '20px', alignItems: 'center', padding: '12px', border: '1px solid var(--border)', background: 'var(--white)' }}>
               <Link to={`/watch/${video.id}`} style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
                 <img src={video.thumbnail} alt={video.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                 <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = 1} onMouseLeave={(e) => e.currentTarget.style.opacity = 0}>
                    <PlayCircle size={40} color="#fff" />
                 </div>
               </Link>
               
               <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>{video.title}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--gray-600)', fontWeight: 500 }}>{video.creator.fullName}</p>
                  <p style={{ fontSize: '12px', color: 'var(--gray-400)', marginTop: '8px' }}>Watched on {formatDate(video.watchedAt, 'MMM D, YYYY [at] h:mm A')}</p>
               </div>
               
               <button className="icon-btn" style={{ color: 'var(--gray-400)' }} onClick={() => removeFromHistory(video.id)}>
                 <Trash2 size={18} />
               </button>
             </div>
           ))
         ) : (
           <div className="empty-state">
             <Clock size={48} className="empty-state__icon" />
             <h2 className="empty-state__title">History is empty</h2>
             <p className="empty-state__desc">Videos you watch will appear here.</p>
           </div>
         )}
      </div>
    </div>
  );
};

export default History;
