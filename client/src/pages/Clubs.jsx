import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search as SearchIcon, MapPin, Tag, Plus, Check } from 'lucide-react';

const CLUB_CATEGORIES = ['All', 'Technical', 'Cultural', 'Sports', 'Social', 'Academic'];

const MOCK_CLUBS = [
  { id: 'tech-1', name: 'Robotics Club', category: 'Technical', members: 420, bio: 'Building the future, one robot at a time. We specialize in autonomous drones and AI.', logo: 'RC', banner: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=800', isJoined: false },
  { id: 'cult-1', name: 'Dance Society', category: 'Cultural', members: 150, bio: 'Expressing life through rhythm and movement. From classical to contemporary hip-hop.', logo: 'DS', banner: 'https://images.pexels.com/photos/1701202/pexels-photo-1701202.jpeg?auto=compress&cs=tinysrgb&w=800', isJoined: true },
  { id: 'tech-2', name: 'Coding Club', category: 'Technical', members: 890, bio: 'The heartbeat of campus developers. We host hackathons, workshops, and open-source projects.', logo: 'CC', banner: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800', isJoined: false },
  { id: 'sports-1', name: 'Athletics Team', category: 'Sports', members: 120, bio: 'Home of the campus champions. We prepare for inter-college meets and national events.', logo: 'AT', banner: 'https://images.pexels.com/photos/2261477/pexels-photo-2261477.jpeg?auto=compress&cs=tinysrgb&w=800', isJoined: false },
  { id: 'social-1', name: 'Eco Warriors', category: 'Social', members: 310, bio: 'Making our campus green and sustainable. We plant trees and organize recycling drives.', logo: 'EW', banner: 'https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=800', isJoined: false },
  { id: 'acad-1', name: 'Debate Society', category: 'Academic', members: 85, bio: 'Articulating ideas and challenging perspectives. The official debating body of the college.', logo: 'DB', banner: 'https://images.pexels.com/photos/2833037/pexels-photo-2833037.jpeg?auto=compress&cs=tinysrgb&w=800', isJoined: false },
  { id: 'cult-2', name: 'Tourism Club', category: 'Cultural', members: 245, bio: 'Exploring hidden gems and experiencing diverse cultures. We organize heritage walks and trips.', logo: 'TC', banner: 'https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg?auto=compress&cs=tinysrgb&w=800', isJoined: false },
  { id: 'sports-2', name: 'Sports Club', category: 'Sports', members: 560, bio: 'The ultimate destination for all sports enthusiasts. From indoor games to outdoor leagues.', logo: 'SC', banner: 'https://images.pexels.com/photos/3684122/pexels-photo-3684122.jpeg?auto=compress&cs=tinysrgb&w=800', isJoined: false },
  { id: 'social-2', name: 'NSS', category: 'Social', members: 1200, bio: 'National Service Scheme. Committed to social welfare, community service, and nation building.', logo: 'NS', banner: 'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=800', isJoined: false },
  { id: 'social-3', name: 'Green Club', category: 'Social', members: 180, bio: 'Advocating for environmental preservation and sustainability through campus-wide initiatives.', logo: 'GC', banner: 'https://images.pexels.com/photos/302804/pexels-photo-302804.jpeg?auto=compress&cs=tinysrgb&w=800', isJoined: false },
  { id: 'acad-2', name: 'Maths Club', category: 'Academic', members: 95, bio: 'Deciphering the language of the universe. Join us for math puzzles, olympiads, and logic sessions.', logo: 'MC', banner: 'https://images.pexels.com/photos/6256070/pexels-photo-6256070.jpeg?auto=compress&cs=tinysrgb&w=800', isJoined: false },
  { id: 'acad-3', name: 'Science Club', category: 'Academic', members: 210, bio: 'Conducting experiments and exploring scientific breakthroughs across all major disciplines.', logo: 'SX', banner: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=800', isJoined: false },
  { id: 'sports-3', name: 'Yoga Club', category: 'Sports', members: 340, bio: 'Uniting mind, body, and soul. Discover inner peace and physical wellness through daily yoga.', logo: 'YC', banner: 'https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&cs=tinysrgb&w=800', isJoined: false },
  { id: 'cult-3', name: 'Film Club', category: 'Cultural', members: 480, bio: 'For the love of cinema. We screen classics, host film discussions, and organize short film events.', logo: 'FC', banner: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=800', isJoined: false },
  { id: 'cult-4', name: 'Music Club', category: 'Cultural', members: 630, bio: 'A symphony of talents. We organize jam sessions, concerts, and music production workshops.', logo: 'MS', banner: 'https://images.pexels.com/photos/1644614/pexels-photo-1644614.jpeg?auto=compress&cs=tinysrgb&w=800', isJoined: false },
  { id: 'cult-5', name: 'Drama Club', category: 'Cultural', members: 215, bio: 'Bringing stories to life on stage. Join us for acting, directing, and stagecraft development.', logo: 'DR', banner: 'https://images.pexels.com/photos/2635390/pexels-photo-2635390.jpeg?auto=compress&cs=tinysrgb&w=800', isJoined: false },
  { id: 'cult-6', name: 'Art Club', category: 'Cultural', members: 390, bio: 'Where creativity meets canvas. Explore fine arts, digital illustration, and mural painting.', logo: 'AC', banner: 'https://images.pexels.com/photos/102127/pexels-photo-102127.jpeg?auto=compress&cs=tinysrgb&w=800', isJoined: false },
  { id: 'tech-3', name: 'Design Club', category: 'Technical', members: 450, bio: 'Shaping user experiences and visual aesthetics. Focus on UI/UX, branding, and product design.', logo: 'DC', banner: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800', isJoined: false },
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
