import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, ListVideo, Clock, MoreVertical, Plus, Trash2, Search as SearchIcon } from 'lucide-react';
import { formatRelativeTime } from '../utils/formatters';

const MOCK_PLAYLISTS = [
  { id: 'pl-1', title: 'Data Structures 101', videoCount: 12, lastUpdated: '2024-04-10T10:00:00', thumbnail: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=640', isPrivate: false },
  { id: 'pl-2', title: 'Campus Fest Highlights', videoCount: 24, lastUpdated: '2024-03-22T14:30:00', thumbnail: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=640', isPrivate: true },
  { id: 'pl-3', title: 'Final Project References', videoCount: 8, lastUpdated: '2024-04-20T09:15:00', thumbnail: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=640', isPrivate: true },
  { id: 'pl-4', title: 'Coding Club Workshop', videoCount: 5, lastUpdated: '2024-02-15T11:00:00', thumbnail: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=640', isPrivate: false },
];

const Playlists = () => {
  const [playlists, setPlaylists] = useState(MOCK_PLAYLISTS);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlaylists = playlists.filter(pl => 
    pl.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-pad">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 className="auth-title" style={{ marginBottom: '8px' }}>Your Playlists</h1>
          <p className="auth-subtitle" style={{ marginBottom: 0 }}>Organize videos for your courses and interests.</p>
        </div>
        <button className="btn btn--primary" style={{ gap: '8px' }}>
          <Plus size={16} /> New Playlist
        </button>
      </div>

      <div className="search-bar" style={{ maxWidth: '400px', marginBottom: '32px' }}>
        <div className="search-bar__wrap">
          <span className="search-bar__icon"><SearchIcon size={14} /></span>
          <input 
            className="search-bar__input" 
            type="text" 
            placeholder="Search playlists..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="video-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
        {filteredPlaylists.map(playlist => (
          <div key={playlist.id} className="video-card">
            <Link to={`/playlist/${playlist.id}`} className="video-card__thumb" style={{ background: '#000' }}>
              <img src={playlist.thumbnail} alt={playlist.title} style={{ opacity: 0.8 }} />
              <div style={{ position: 'absolute', inset: 0, left: '60%', background: 'rgba(0,0,0,0.8)', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <ListVideo size={24} style={{ marginBottom: '4px' }} />
                <span style={{ fontSize: '14px', fontWeight: 700 }}>{playlist.videoCount}</span>
              </div>
              <div style={{ position: 'absolute', bottom: '8px', left: '8px' }}>
                {playlist.isPrivate && <span className="badge badge--black" style={{ background: 'rgba(0,0,0,0.6)', fontSize: '9px' }}>Private</span>}
              </div>
            </Link>
            <div className="video-card__body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 className="video-card__title" style={{ fontSize: '15px' }}>{playlist.title}</h3>
                <button className="icon-btn" style={{ width: '24px', height: '24px' }}><MoreVertical size={14} /></button>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--gray-500)', marginTop: '4px' }}>Updated {formatRelativeTime(playlist.lastUpdated)}</p>
              <Link to={`/playlist/${playlist.id}`} className="section-link" style={{ marginTop: '12px', display: 'inline-block', fontSize: '12px' }}>View full playlist</Link>
            </div>
          </div>
        ))}
      </div>

      {filteredPlaylists.length === 0 && (
        <div className="empty-state">
          <ListVideo size={48} className="empty-state__icon" />
          <h2 className="empty-state__title">No playlists found</h2>
          <p className="empty-state__desc">Create a new playlist to get started.</p>
        </div>
      )}
    </div>
  );
};

export default Playlists;
