import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Home, Flame, Library, Users, Ticket,
  GraduationCap, History, Heart, Signal, Settings,
  Shield, Clapperboard, Timer, Upload, ListVideo,
  Info, Plus
} from 'lucide-react';

const Sidebar = () => {
  const { sidebarOpen, sidebarCollapsed } = useSelector((s) => s.ui);
  const { user } = useSelector((s) => s.auth);

  if (!sidebarOpen) return null;

  const main = [
    { to: '/', icon: <Home size={17} />, label: 'Home', exact: true },
    { to: '/upload', icon: <Upload size={17} />, label: 'Upload' },
    { to: '/shorts', icon: <Clapperboard size={17} />, label: 'Shorts' },
    { to: '/subscriptions', icon: <Library size={17} />, label: 'Subscriptions' },
  ];

  const library = [
    { to: '/history', icon: <History size={17} />, label: 'Watch History' },
    { to: '/playlists', icon: <ListVideo size={17} />, label: 'Playlists' },
    { to: '/liked', icon: <Heart size={17} />, label: 'Liked Videos' },
    { to: '/saved', icon: <Timer size={17} />, label: 'Watch Later' },
  ];

  const explore = [
    { to: '/search?filter=trending', icon: <Flame size={17} />, label: 'Trending' },
    { to: '/departments', icon: <GraduationCap size={17} />, label: 'Departments' },
    { to: '/clubs', icon: <Users size={17} />, label: 'Clubs' },
    { to: '/events', icon: <Ticket size={17} />, label: 'Events' },
    { to: '/live', icon: <Signal size={17} />, label: 'Live', badge: 'LIVE' },
  ];

  const bottom = [
    { to: '/settings', icon: <Settings size={17} />, label: 'Settings' },
    { to: '/help', icon: <Info size={17} />, label: 'Help' },
  ];

  const cls = `sidebar ${sidebarCollapsed ? 'collapsed' : ''}`;

  const renderLinks = (links) =>
    links.map((link) => (
      <NavLink
        key={link.to}
        to={link.to}
        end={link.exact}
        className={({ isActive }) => `sidebar__item ${isActive ? 'active' : ''}`}
        title={sidebarCollapsed ? link.label : undefined}
      >
        {link.icon}
        <span className="sidebar__item-text">{link.label}</span>
        {link.badge && (
          <span className={`sidebar__badge ${link.badge === 'LIVE' ? 'sidebar__badge--live' : ''}`}>
            {link.badge}
          </span>
        )}
      </NavLink>
    ));

  return (
    <aside className={cls}>
      <div className="sidebar__section">{renderLinks(main)}</div>

      <div className="sidebar__section">
        {!sidebarCollapsed && <div className="sidebar__label">Library</div>}
        {renderLinks(library)}
      </div>

      <div className="sidebar__section">
        {!sidebarCollapsed && <div className="sidebar__label">Explore</div>}
        {renderLinks(explore)}
      </div>

      {user && (
        <div className="sidebar__section">
          {!sidebarCollapsed && <div className="sidebar__label">Your Clubs</div>}
          {user.clubs && user.clubs.length > 0 ? (
            user.clubs.slice(0, 4).map((club) => (
              <NavLink 
                key={club.id} 
                to={`/clubs/${club.id}`} 
                className="sidebar__item"
                title={sidebarCollapsed ? club.name : undefined}
              >
                <div className="sidebar__club-dot">{club.name[0]}</div>
                <span className="sidebar__item-text">{club.name}</span>
              </NavLink>
            ))
          ) : (
            !sidebarCollapsed && <div className="sidebar__empty-text">No clubs joined yet</div>
          )}
          <NavLink 
            to="/clubs" 
            className="sidebar__item" 
            title={sidebarCollapsed ? 'Browse All Clubs' : undefined}
          >
            <Plus size={17} />
            <span className="sidebar__item-text">Browse All Clubs</span>
          </NavLink>
        </div>
      )}

      {user?.user_metadata?.role === 'admin' && !sidebarCollapsed && (
        <div className="sidebar__section">
          <NavLink to="/admin" className="sidebar__item">
            <Shield size={17} />
            <span className="sidebar__item-text">Admin Panel</span>
          </NavLink>
        </div>
      )}

      <div className="sidebar__bottom-section">
        {renderLinks(bottom)}
      </div>
    </aside>
  );
};

export default Sidebar;
