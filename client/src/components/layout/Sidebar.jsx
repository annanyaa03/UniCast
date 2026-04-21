import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Home, TrendingUp, Play, Users, Calendar,
  BookOpen, Clock, ThumbsUp, Radio, Settings,
  Shield, Tv, Bookmark, Search,
} from 'lucide-react';

const Sidebar = () => {
  const { sidebarOpen, sidebarCollapsed } = useSelector((s) => s.ui);
  const { user } = useSelector((s) => s.auth);
  const { unreadCount } = useSelector((s) => s.notifications);

  const main = [
    { to: '/', icon: <Home size={17} />, label: 'Home', exact: true },
    { to: '/shorts', icon: <Tv size={17} />, label: 'Shorts' },
    { to: '/subscriptions', icon: <Play size={17} />, label: 'Subscriptions' },
  ];

  const library = [
    { to: '/history', icon: <Clock size={17} />, label: 'History' },
    { to: '/playlists', icon: <BookOpen size={17} />, label: 'Playlists' },
    { to: '/liked', icon: <ThumbsUp size={17} />, label: 'Liked Videos' },
    { to: '/saved', icon: <Bookmark size={17} />, label: 'Saved' },
  ];

  const explore = [
    { to: '/search?filter=trending', icon: <TrendingUp size={17} />, label: 'Trending' },
    { to: '/clubs', icon: <Users size={17} />, label: 'Clubs' },
    { to: '/events', icon: <Calendar size={17} />, label: 'Events' },
    { to: '/live', icon: <Radio size={17} />, label: 'Live', badge: 'LIVE' },
  ];

  if (!sidebarOpen) return null;

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
        {link.badge && <span className="sidebar__badge" style={{ background: 'var(--red)', fontSize: 9 }}>{link.badge}</span>}
      </NavLink>
    ));

  return (
    <aside className={cls}>
      <div className="sidebar__section">{renderLinks(main)}</div>

      {user && (
        <div className="sidebar__section">
          <div className="sidebar__label">Library</div>
          {renderLinks(library)}
        </div>
      )}

      <div className="sidebar__section">
        <div className="sidebar__label">Explore</div>
        {renderLinks(explore)}
      </div>

      {user && (
        <div className="sidebar__section">
          <NavLink to="/settings" className={({ isActive }) => `sidebar__item ${isActive ? 'active' : ''}`}>
            <Settings size={17} />
            <span className="sidebar__item-text">Settings</span>
          </NavLink>
          {user?.user_metadata?.role === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) => `sidebar__item ${isActive ? 'active' : ''}`}>
              <Shield size={17} />
              <span className="sidebar__item-text">Admin</span>
            </NavLink>
          )}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
