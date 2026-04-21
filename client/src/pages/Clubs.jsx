import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search as SearchIcon, MapPin, Tag, Plus, Check } from 'lucide-react';

const CLUB_CATEGORIES = ['All', 'Technical', 'Cultural', 'Sports', 'Social', 'Academic'];

const MOCK_CLUBS = [
  { id: 'tech-1', name: 'Robotics Club', category: 'Technical', members: 420, bio: 'Building the future, one robot at a time. We specialize in autonomous drones and AI.', logo: 'RC', banner: 'https://picsum.photos/seed/robotics/600/200', isJoined: false },
  { id: 'cult-1', name: 'Dance Society', category: 'Cultural', members: 150, bio: 'Expressing life through rhythm and movement. From classical to contemporary hip-hop.', logo: 'DS', banner: 'https://picsum.photos/seed/dance/600/200', isJoined: true },
  { id: 'tech-2', name: 'Coding Club', category: 'Technical', members: 890, bio: 'The heartbeat of campus developers. We host hackathons, workshops, and open-source projects.', logo: 'CC', banner: 'https://picsum.photos/seed/coding/600/200', isJoined: false },
  { id: 'sports-1', name: 'Athletics Team', category: 'Sports', members: 120, bio: 'Home of the campus champions. We prepare for inter-college meets and national events.', logo: 'AT', banner: 'https://picsum.photos/seed/sports/600/200', isJoined: false },
  { id: 'social-1', name: 'Eco Warriors', category: 'Social', members: 310, bio: 'Making our campus green and sustainable. We plant trees and organize recycling drives.', logo: 'EW', banner: 'https://picsum.photos/seed/eco/600/200', isJoined: false },
  { id: 'acad-1', name: 'Debate Society', category: 'Academic', members: 85, bio: 'Articulating ideas and challenging perspectives. The official debating body of the college.', logo: 'DB', banner: 'https://picsum.photos/seed/debate/600/200', isJoined: false },
];

const Clubs = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [clubs, setClubs] = useState(MOCK_CLUBS);

  const filteredClubs = clubs.filter(club => {
    const matchesCategory = activeCategory === 'All' || club.category === activeCategory;
    const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          club.bio.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleJoin = (id) => {
    setClubs(prev => prev.map(c => c.id === id ? { ...c, isJoined: !c.isJoined, members: c.isJoined ? c.members - 1 : c.members + 1 } : c));
  };

  return (
    <div className="page-pad">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 className="auth-title" style={{ marginBottom: '8px' }}>College Clubs</h1>
          <p className="auth-subtitle" style={{ marginBottom: 0 }}>Join societies and groups that match your interests.</p>
        </div>
        <button className="btn btn--primary" style={{ gap: '8px' }}>
          <Plus size={16} /> Create Club
        </button>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <div className="search-bar" style={{ maxWidth: '400px' }}>
          <div className="search-bar__wrap">
            <span className="search-bar__icon"><SearchIcon size={14} /></span>
            <input 
              className="search-bar__input" 
              type="text" 
              placeholder="Search clubs..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {CLUB_CATEGORIES.map(cat => (
          <button 
            key={cat} 
            className={`category-chip ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="video-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
        {filteredClubs.map(club => (
          <div key={club.id} className="club-card">
            <div className="club-card__banner">
              <img src={club.banner} alt={club.name} />
              <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
                <span className="badge badge--black" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>{club.category}</span>
              </div>
            </div>
            <div className="club-card__body">
              <div className="club-card__logo">{club.logo}</div>
              <Link to={`/clubs/${club.id}`} className="club-card__name" style={{ display: 'block' }}>{club.name}</Link>
              <p className="club-card__desc">{club.bio}</p>
              
              <div className="club-card__footer">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--gray-500)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={14} /> {club.members} members</span>
                </div>
                <button 
                  className={`btn btn--sm ${club.isJoined ? 'btn--outline' : 'btn--primary'}`}
                  onClick={() => toggleJoin(club.id)}
                  style={{ gap: '6px' }}
                >
                  {club.isJoined ? <Check size={14} /> : <Plus size={14} />}
                  {club.isJoined ? 'Joined' : 'Join'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredClubs.length === 0 && (
        <div className="empty-state">
          <Users size={48} className="empty-state__icon" />
          <h2 className="empty-state__title">No clubs found</h2>
          <p className="empty-state__desc">Try a different category or search term.</p>
        </div>
      )}
    </div>
  );
};

export default Clubs;
