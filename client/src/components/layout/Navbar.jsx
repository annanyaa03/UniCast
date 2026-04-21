import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Menu, Search, X, Upload, Bell, ChevronDown,
  Settings, LogOut, Shield, Video, BookOpen, User,
} from 'lucide-react';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { logoutUser } from '../../store/slices/authSlice';
import { markAllRead } from '../../store/slices/notificationSlice';
import useDebounce from '../../hooks/useDebounce';
import { formatRelativeTime } from '../../utils/formatters';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((s) => s.auth);
  const { unreadCount, items: notifs } = useSelector((s) => s.notifications);

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSugg, setShowSugg] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  const debouncedQ = useDebounce(query, 350);
  const searchRef = useRef(null);
  const userRef = useRef(null);
  const notifRef = useRef(null);

  const MOCK_SUGGESTIONS = [
    'Data Structures Lecture',
    'College Fest 2024',
    'Robotics Club',
    'Machine Learning Workshop',
    'Sports Day',
  ];

  useEffect(() => {
    if (debouncedQ.trim().length > 1) {
      setSuggestions(MOCK_SUGGESTIONS.filter((s) => s.toLowerCase().includes(debouncedQ.toLowerCase())));
      setShowSugg(true);
    } else {
      setSuggestions([]);
      setShowSugg(false);
    }
  }, [debouncedQ]);

  useEffect(() => {
    const handle = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSugg(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUser(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) { navigate(`/search?q=${encodeURIComponent(query.trim())}`); setShowSugg(false); }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const displayName = user?.user_metadata?.full_name || user?.email || 'User';
  const initial = displayName.charAt(0).toUpperCase();
  const avatar = user?.user_metadata?.avatar_url;

  return (
    <nav className="navbar">
      {/* Left */}
      <div className="navbar__left">
        <button className="hamburger-btn" onClick={() => dispatch(toggleSidebar())} aria-label="Toggle sidebar">
          <Menu size={20} />
        </button>
        <Link to="/" className="navbar__logo">
          <div className="navbar__logo-mark"><span>UC</span></div>
          UniCast
        </Link>
      </div>

      {/* Center — Search */}
      <div className="navbar__center">
        <div className="search-bar" ref={searchRef}>
          <form onSubmit={handleSearch}>
            <div className="search-bar__wrap">
              <span className="search-bar__icon"><Search size={14} /></span>
              <input
                id="main-search"
                className="search-bar__input"
                type="text"
                placeholder="Search videos, clubs, events..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query.length > 1 && setShowSugg(true)}
                autoComplete="off"
              />
              {query && (
                <button type="button" style={{ padding: '0 10px', color: 'var(--gray-400)', display: 'flex', alignItems: 'center' }}
                  onClick={() => { setQuery(''); setSuggestions([]); }}>
                  <X size={13} />
                </button>
              )}
              <button type="submit" className="search-bar__btn">
                <Search size={13} />
                Search
              </button>
            </div>
          </form>

          {showSugg && suggestions.length > 0 && (
            <div className="search-suggestions">
              {suggestions.map((s, i) => (
                <div key={i} className="suggestion-item"
                  onClick={() => { setQuery(s); navigate(`/search?q=${encodeURIComponent(s)}`); setShowSugg(false); }}>
                  <Search size={12} />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right */}
      <div className="navbar__right">
        {token && user ? (
          <>
            <Link to="/upload" className="btn btn--outline btn--sm">
              <Upload size={13} />
              Upload
            </Link>

            {/* Notifications */}
            <div style={{ position: 'relative' }} ref={notifRef}>
              <button className="icon-btn" onClick={() => setShowNotif(!showNotif)} aria-label="Notifications">
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="icon-btn__badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
              </button>
              {showNotif && (
                <div className="notif-panel">
                  <div className="notif-panel__header">
                    <span className="notif-panel__title">Notifications</span>
                    <button className="btn btn--ghost btn--sm" onClick={() => dispatch(markAllRead())}>
                      Mark all read
                    </button>
                  </div>
                  <div className="notif-panel__body">
                    {notifs.length === 0 ? (
                      <div className="notif-panel__empty">No notifications yet</div>
                    ) : (
                      notifs.slice(0, 8).map((n, i) => (
                        <div key={n.id || i} className={`notif-item ${!n.isRead ? 'notif-item--unread' : ''}`}>
                          {!n.isRead && <div className="notif-dot" />}
                          <div>
                            <div className="notif-item__msg">{n.message}</div>
                            <div className="notif-item__time">{n.createdAt ? formatRelativeTime(n.createdAt) : ''}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div style={{ position: 'relative' }} ref={userRef}>
              <button className="avatar-btn" onClick={() => setShowUser(!showUser)}>
                {avatar ? (
                  <img src={avatar} alt={displayName} className="avatar-btn__img" />
                ) : (
                  <div className="avatar-btn__placeholder">{initial}</div>
                )}
                <ChevronDown size={12} />
              </button>
              {showUser && (
                <div className="dropdown" style={{ right: 0, top: 'calc(100% + 6px)' }}>
                  <div className="dropdown__header">
                    <div className="dropdown__name">{displayName}</div>
                    <div className="dropdown__email">{user.email}</div>
                  </div>
                  <div className="dropdown__divider" />
                  <Link to={`/channel/${user.id}`} className="dropdown__item" onClick={() => setShowUser(false)}>
                    <User size={14} /> Your Channel
                  </Link>
                  <Link to="/playlists" className="dropdown__item" onClick={() => setShowUser(false)}>
                    <BookOpen size={14} /> Playlists
                  </Link>
                  <Link to="/upload" className="dropdown__item" onClick={() => setShowUser(false)}>
                    <Video size={14} /> Upload Video
                  </Link>
                  <Link to="/settings" className="dropdown__item" onClick={() => setShowUser(false)}>
                    <Settings size={14} /> Settings
                  </Link>
                  {(user?.user_metadata?.role === 'admin') && (
                    <>
                      <div className="dropdown__divider" />
                      <Link to="/admin" className="dropdown__item dropdown__item--admin" onClick={() => setShowUser(false)}>
                        <Shield size={14} /> Admin Dashboard
                      </Link>
                    </>
                  )}
                  <div className="dropdown__divider" />
                  <button className="dropdown__item dropdown__item--danger" onClick={handleLogout}>
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn--ghost btn--sm">Sign In</Link>
            <Link to="/register" className="btn btn--primary btn--sm">Join UniCast</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
