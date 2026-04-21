import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar as CalendarIcon, MapPin, Clock, Tag, Search as SearchIcon, Plus, ChevronRight } from 'lucide-react';
import { formatDate } from '../utils/formatters';

const EVENT_CATEGORIES = ['All', 'Technical', 'Cultural', 'Sports', 'Academic', 'Workshops'];

const MOCK_EVENTS = [
  { id: 'ev-1', title: 'Grand Annual Fest 2024', date: '2024-05-15T10:00:00', venue: 'Main Auditorium', category: 'Cultural', organizer: 'Cultural Council', image: 'https://picsum.photos/seed/fest/800/400', isAttending: false },
  { id: 'ev-2', title: 'Inter-College Hackathon', date: '2024-04-28T09:00:00', venue: 'IT Block - CS Lab', category: 'Technical', organizer: 'Coding Club', image: 'https://picsum.photos/seed/hack/800/400', isAttending: true },
  { id: 'ev-3', title: 'Machine Learning Workshop', date: '2024-05-02T14:30:00', venue: 'Seminar Hall 1', category: 'Workshops', organizer: 'Robotics Club', image: 'https://picsum.photos/seed/workshop/800/400', isAttending: false },
  { id: 'ev-4', title: 'Annual Cricket Tournament', date: '2024-05-10T08:00:00', venue: 'Sports Ground', category: 'Sports', organizer: 'Sports Committee', image: 'https://picsum.photos/seed/cricket/800/400', isAttending: false },
  { id: 'ev-5', title: 'Guest Lecture: Future of AI', date: '2024-04-25T11:00:00', venue: 'Block 2 Auditorium', category: 'Academic', organizer: 'CSE Department', image: 'https://picsum.photos/seed/lecture/800/400', isAttending: false },
];

const Events = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState(MOCK_EVENTS);

  const filteredEvents = events.filter(ev => {
    const matchesCategory = activeCategory === 'All' || ev.category === activeCategory;
    const matchesSearch = ev.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ev.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleRSVP = (id) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, isAttending: !e.isAttending } : e));
  };

  return (
    <div className="page-pad">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 className="auth-title" style={{ marginBottom: '8px' }}>Campus Events</h1>
          <p className="auth-subtitle" style={{ marginBottom: 0 }}>Never miss an important event at your college.</p>
        </div>
        <button className="btn btn--primary" style={{ gap: '8px' }}>
          <Plus size={16} /> Post Event
        </button>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <div className="search-bar" style={{ maxWidth: '400px' }}>
          <div className="search-bar__wrap">
            <span className="search-bar__icon"><SearchIcon size={14} /></span>
            <input 
              className="search-bar__input" 
              type="text" 
              placeholder="Search events..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {EVENT_CATEGORIES.map(cat => (
          <button 
            key={cat} 
            className={`category-chip ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {filteredEvents.map(event => (
          <div key={event.id} style={{ display: 'grid', gridTemplateColumns: '300px 1fr', border: '1px solid var(--border)', background: 'var(--white)', overflow: 'hidden' }}>
            <div style={{ position: 'relative', overflow: 'hidden' }}>
              <img src={event.image} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                <span className="badge badge--black">{event.category}</span>
              </div>
            </div>
            
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '4px', letterSpacing: '-0.02em' }}>{event.title}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--blue)', fontWeight: 600 }}>By {event.organizer}</p>
                </div>
                <button 
                  className={`btn btn--sm ${event.isAttending ? 'btn--outline' : 'btn--primary'}`}
                  onClick={() => toggleRSVP(event.id)}
                >
                  {event.isAttending ? 'Im attending' : 'RSVP Now'}
                </button>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--gray-600)' }}>
                  <CalendarIcon size={16} />
                  <div>
                    <p style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, color: 'var(--gray-400)' }}>Date</p>
                    <p style={{ fontSize: '13px' }}>{formatDate(event.date)}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--gray-600)' }}>
                  <Clock size={16} />
                  <div>
                    <p style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, color: 'var(--gray-400)' }}>Time</p>
                    <p style={{ fontSize: '13px' }}>10:00 AM onwards</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--gray-600)' }}>
                  <MapPin size={16} />
                  <div>
                    <p style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, color: 'var(--gray-400)' }}>Venue</p>
                    <p style={{ fontSize: '13px' }}>{event.venue}</p>
                  </div>
                </div>
              </div>
              
              <div style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                <Link to={`/events/${event.id}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: 'var(--gray-900)' }}>
                  View details <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="empty-state">
          <CalendarIcon size={48} className="empty-state__icon" />
          <h2 className="empty-state__title">No events found</h2>
          <p className="empty-state__desc">Check back later for new events.</p>
        </div>
      )}
    </div>
  );
};

export default Events;
