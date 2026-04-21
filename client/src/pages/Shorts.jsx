import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThumbsUp, ThumbsDown, MessageSquare, Share2, MoreVertical, Music, User } from 'lucide-react';
import { formatViews } from '../utils/formatters';

const MOCK_SHORTS = [
  { id: 'sh-1', title: 'Amazing science experiment! 🧪 #science #lab', creator: 'Prof. Sharma', views: 45200, likes: 2100, videoUrl: 'https://cdn.pixabay.com/vimeo/327334/water-flow-32733.mp4?width=1080&v=1', sound: 'Original Audio - Prof. Sharma' },
  { id: 'sh-2', title: 'Campus early morning view ☀️ #college #morning', creator: 'Ananya S.', views: 12000, likes: 850, videoUrl: 'https://cdn.pixabay.com/vimeo/452331/sunrise-45233.mp4?width=1080&v=1', sound: 'Morning Vibes - Lo-fi' },
  { id: 'sh-3', title: 'Coding hack for Python developers 🐍 #coding #python', creator: 'Tech Society', views: 85000, likes: 5400, videoUrl: 'https://cdn.pixabay.com/vimeo/356332/matrix-35633.mp4?width=1080&v=1', sound: 'Synthwave Beats' },
];

const Shorts = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);

  const handleScroll = () => {
    if (containerRef.current) {
      const index = Math.round(containerRef.current.scrollTop / containerRef.current.clientHeight);
      setCurrentIndex(index);
    }
  };

  return (
    <div className="main-content no-sidebar" style={{ height: 'calc(100vh - var(--nav-height))', overflow: 'hidden' }}>
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        style={{ 
          height: '100%', 
          overflowY: 'scroll', 
          scrollSnapType: 'y mandatory',
          scrollBehavior: 'smooth'
        }}
      >
        {MOCK_SHORTS.map((short, index) => (
          <div 
            key={short.id} 
            style={{ 
              height: '100%', 
              width: '100%', 
              scrollSnapAlign: 'start', 
              position: 'relative',
              background: '#000',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            {/* Background blur */}
            <div style={{ 
              position: 'absolute', 
              inset: 0, 
              backgroundImage: `url(https://picsum.photos/seed/${short.id}/10/20)`, 
              backgroundSize: 'cover', 
              filter: 'blur(30px) brightness(0.4)',
              zIndex: 0
            }} />

            {/* Video Placeholder */}
            <div style={{ 
              height: '100%', 
              aspectRatio: '9/16', 
              background: '#000', 
              position: 'relative', 
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
               <video 
                src={short.videoUrl} 
                autoPlay={index === currentIndex} 
                loop 
                muted 
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
               />
            </div>

            {/* Content Overlay */}
            <div style={{ 
              position: 'absolute', 
              bottom: 0, 
              left: '50%', 
              transform: 'translateX(-50%)', 
              width: '100%', 
              maxWidth: '500px', 
              height: '100%', 
              pointerEvents: 'none',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
                <div style={{ flex: 1, pointerEvents: 'auto' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ width: '40px', height: '40px', background: 'var(--gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #fff' }}>
                      <User size={24} color="#000" />
                    </div>
                    <div>
                      <p style={{ color: '#fff', fontWeight: 700, fontSize: '15px' }}>@{short.creator}</p>
                      <button className="btn btn--sm" style={{ padding: '4px 12px', fontSize: '12px', background: '#fff', color: '#000', marginTop: '4px' }}>Subscribe</button>
                    </div>
                  </div>
                  <h3 style={{ color: '#fff', fontSize: '14px', lineHeight: '1.4', marginBottom: '16px', fontWeight: 500 }}>{short.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '13px' }}>
                    <Music size={14} />
                    <span style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{short.sound}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', pointerEvents: 'auto' }}>
                  <button style={{ color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '44px', height: '44px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ThumbsUp size={22} />
                    </div>
                    <span style={{ fontSize: '12px' }}>{formatViews(short.likes)}</span>
                  </button>
                  <button style={{ color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '44px', height: '44px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ThumbsDown size={22} />
                    </div>
                    <span style={{ fontSize: '12px' }}>Dislike</span>
                  </button>
                  <button style={{ color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '44px', height: '44px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MessageSquare size={22} />
                    </div>
                    <span style={{ fontSize: '12px' }}>124</span>
                  </button>
                  <button style={{ color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '44px', height: '44px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Share2 size={22} />
                    </div>
                    <span style={{ fontSize: '12px' }}>Share</span>
                  </button>
                  <button style={{ color: '#fff' }}><MoreVertical size={22} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shorts;
