import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { User, Video, BookOpen, Info, Bell, BellOff, MessageSquare, Twitter, Github, Linkedin } from 'lucide-react';
import { fetchFeed, resetFeed } from '../store/slices/videoSlice';
import VideoCard, { VideoCardSkeleton } from '../components/common/VideoCard';
import useInfiniteScroll from '../hooks/useInfiniteScroll';

const TABS = [
  { id: 'videos', label: 'Videos', icon: <Video size={14} /> },
  { id: 'playlists', label: 'Playlists', icon: <BookOpen size={14} /> },
  { id: 'about', label: 'About', icon: <Info size={14} /> },
];

const Channel = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { feed, feedLoading, hasMore, page } = useSelector((state) => state.video);
  const { user: currentUser } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('videos');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [channelData, setChannelData] = useState({
    id,
    fullName: 'Channel Name',
    username: 'username',
    bio: 'Professional bio and information about the channel creator.',
    subscribers: 1240,
    videos: 42,
    banner: 'https://picsum.photos/seed/banner/1200/200',
    avatar: '',
    department: 'Computer Science',
    year: '3rd Year',
    socials: { twitter: '#', github: '#', linkedin: '#' }
  });

  useEffect(() => {
    // Mock fetching channel data
    setChannelData(prev => ({
      ...prev,
      fullName: id === 'prof-1' ? 'Prof. Ranjit Sharma' : 'Tech Society UniCast',
      username: id === 'prof-1' ? 'prof_sharma' : 'tech_society'
    }));

    dispatch(resetFeed());
    dispatch(fetchFeed({ creatorId: id, page: 1 }));
  }, [id, dispatch]);

  const loadMore = () => {
    if (!feedLoading && hasMore) {
      dispatch(fetchFeed({ creatorId: id, page }));
    }
  };

  const lastRef = useInfiniteScroll(loadMore, hasMore, feedLoading);

  const isOwnChannel = currentUser?.id === id;

  return (
    <div>
      <div className="channel-banner">
        <img src={channelData.banner} alt="Channel banner" />
      </div>

      <div className="page-pad" style={{ marginTop: '-40px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', marginBottom: '32px', position: 'relative', zIndex: 10 }}>
          <div className="channel-avatar" style={{ width: '120px', height: '120px', fontSize: '48px' }}>
            {channelData.avatar ? (
              <img src={channelData.avatar} alt={channelData.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              channelData.fullName.charAt(0)
            )}
          </div>
          <div style={{ flex: 1, paddingBottom: '8px' }}>
            <h1 className="channel-name" style={{ fontSize: '28px', marginBottom: '4px' }}>{channelData.fullName}</h1>
            <p className="channel-meta" style={{ fontSize: '14px' }}>
              @{channelData.username} • {channelData.subscribers.toLocaleString()} subscribers • {channelData.videos} videos
            </p>
            <p style={{ fontSize: '13px', color: 'var(--gray-500)', marginTop: '4px' }}>
              {channelData.department} • {channelData.year}
            </p>
          </div>
          <div style={{ paddingBottom: '8px', display: 'flex', gap: '12px' }}>
            {isOwnChannel ? (
              <Link to="/settings" className="btn btn--outline">Edit Profile</Link>
            ) : (
              <>
                <button
                  className={`btn ${isSubscribed ? 'btn--outline' : 'btn--primary'}`}
                  onClick={() => setIsSubscribed(!isSubscribed)}
                  style={{ gap: '8px' }}
                >
                  {isSubscribed ? <BellOff size={16} /> : <Bell size={16} />}
                  {isSubscribed ? 'Subscribed' : 'Subscribe'}
                </button>
                <button className="icon-btn" style={{ border: '1px solid var(--border)', width: '40px', height: '40px' }}>
                  <MessageSquare size={18} />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="tab-bar">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div style={{ paddingTop: '24px' }}>
          {activeTab === 'videos' && (
            <div className="video-grid">
              {feed.map((v, i) => (
                <div key={v.id} ref={i === feed.length - 1 ? lastRef : null}>
                  <VideoCard video={v} />
                </div>
              ))}
              {feedLoading && Array.from({ length: 8 }).map((_, i) => <VideoCardSkeleton key={i} />)}
              {!feedLoading && feed.length === 0 && (
                <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                  <Video size={48} className="empty-state__icon" />
                  <h2 className="empty-state__title">No videos yet</h2>
                  <p className="empty-state__desc">This creator hasn't uploaded any videos yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'playlists' && (
            <div className="empty-state">
              <BookOpen size={48} className="empty-state__icon" />
              <h2 className="empty-state__title">No playlists</h2>
              <p className="empty-state__desc">This creator hasn't created any playlists yet.</p>
            </div>
          )}

          {activeTab === 'about' && (
            <div style={{ maxWidth: '800px' }}>
              <div style={{ marginBottom: '32px' }}>
                <h3 className="section-title" style={{ marginBottom: '16px' }}>Description</h3>
                <p style={{ fontSize: '15px', color: 'var(--gray-700)', lineHeight: '1.8' }}>{channelData.bio}</p>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <h3 className="section-title" style={{ marginBottom: '16px' }}>Links</h3>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <a href={channelData.socials.twitter} className="icon-btn" style={{ border: '1px solid var(--border)' }}><Twitter size={20} /></a>
                  <a href={channelData.socials.github} className="icon-btn" style={{ border: '1px solid var(--border)' }}><Github size={20} /></a>
                  <a href={channelData.socials.linkedin} className="icon-btn" style={{ border: '1px solid var(--border)' }}><Linkedin size={20} /></a>
                </div>
              </div>

              <div>
                <h3 className="section-title" style={{ marginBottom: '16px' }}>Stats</h3>
                <p style={{ fontSize: '14px', color: 'var(--gray-600)' }}>Joined Sep 12, 2023</p>
                <div className="divider" style={{ margin: '16px 0' }} />
                <p style={{ fontSize: '14px', color: 'var(--gray-600)' }}>{channelData.subscribers.toLocaleString()} subscribers</p>
                <div className="divider" style={{ margin: '16px 0' }} />
                <p style={{ fontSize: '14px', color: 'var(--gray-600)' }}>12,840 total views</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Channel;
