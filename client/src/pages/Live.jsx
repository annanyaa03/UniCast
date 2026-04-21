import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Radio, Users, MessageSquare, Send, Heart, Share2, MoreVertical } from 'lucide-react';

const MOCK_LIVES = [
  { id: 'live-1', title: 'Hackathon 2024 - Final Presentations', creator: 'Coding Club', viewers: 1840, image: 'https://picsum.photos/seed/live1/1200/600', isLive: true },
  { id: 'live-2', title: 'Campus Night - Live Music Session', creator: 'Cultural Council', viewers: 850, image: 'https://picsum.photos/seed/live2/1200/600', isLive: true },
  { id: 'live-3', title: 'Open Mic Poetry Night', creator: 'Literature Club', viewers: 120, image: 'https://picsum.photos/seed/live3/1200/600', isLive: true },
];

const Live = () => {
  const [activeStream, setActiveStream] = useState(MOCK_LIVES[0]);
  const [chatMessage, setChatMessage] = useState('');
  const [chat, setChat] = useState([
    { user: 'Rahul K.', message: 'This presentation is incredible!' },
    { user: 'Ananya S.', message: 'Love the tech stack they used.' },
    { user: 'Prof. Sharma', message: 'Excellent clear explanations.' },
    { user: 'Divya M.', message: 'When is the result being announced?' },
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setChat([...chat, { user: 'You', message: chatMessage }]);
    setChatMessage('');
  };

  return (
    <div className="page-pad--wide" style={{ padding: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px' }}>
        <div>
          {/* Main Player Area */}
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000', overflow: 'hidden' }}>
            <img src={activeStream.image} alt={activeStream.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', gap: '12px' }}>
              <div style={{ background: 'var(--red)', color: '#fff', padding: '4px 10px', fontSize: '12px', fontWeight: 800, letterSpacing: '0.05em' }}>LIVE</div>
              <div style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', color: '#fff', padding: '4px 10px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={14} /> {activeStream.viewers.toLocaleString()}
              </div>
            </div>
            
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', opacity: 0, transition: 'opacity 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.opacity = 1} onMouseLeave={(e) => e.currentTarget.style.opacity = 0}>
              <div style={{ width: '64px', height: '64px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Radio size={32} color="#000" />
              </div>
            </div>
          </div>

          <div style={{ padding: '24px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.02em' }}>{activeStream.title}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <p style={{ fontSize: '15px', color: 'var(--gray-900)', fontWeight: 700 }}>{activeStream.creator}</p>
                  <span className="badge badge--blue">Official Club</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn--outline" style={{ gap: '8px' }}><Share2 size={16} /> Share</button>
                <button className="icon-btn" style={{ border: '1px solid var(--border)' }}><MoreVertical size={18} /></button>
              </div>
            </div>

            <div className="divider" style={{ marginBottom: '24px' }} />

            <h3 className="section-title" style={{ marginBottom: '16px' }}>More Live Streams</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {MOCK_LIVES.filter(l => l.id !== activeStream.id).map(l => (
                <div key={l.id} className="video-card" onClick={() => setActiveStream(l)}>
                  <div className="video-card__thumb" style={{ background: '#000' }}>
                    <img src={l.image} alt={l.title} style={{ opacity: 0.8 }} />
                    <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'var(--red)', color: '#fff', padding: '2px 6px', fontSize: '10px', fontWeight: 800 }}>LIVE</div>
                    <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '2px 6px', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={12} /> {l.viewers.toLocaleString()}
                    </div>
                  </div>
                  <div className="video-card__body">
                    <p className="video-card__title" style={{ fontSize: '14px' }}>{l.title}</p>
                    <p className="video-card__channel">{l.creator}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Chat Sidebar */}
        <div style={{ height: 'calc(100vh - var(--nav-height) - 48px)', border: '1px solid var(--border)', background: 'var(--white)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700 }}>Live Chat</h2>
            <button style={{ color: 'var(--gray-400)' }}><X size={18} /></button>
          </div>

          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {chat.map((msg, i) => (
              <div key={i} style={{ fontSize: '13px', lineHeight: '1.5' }}>
                <span style={{ fontWeight: 700, color: msg.user === 'You' ? 'var(--blue)' : 'var(--gray-900)', marginRight: '8px' }}>{msg.user}</span>
                <span>{msg.message}</span>
              </div>
            ))}
          </div>

          <div style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Say something..." 
                  style={{ height: '36px', fontSize: '13px' }}
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn--primary" style={{ padding: '0 12px', height: '36px' }}>
                <Send size={16} />
              </button>
            </form>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
              <div style={{ display: 'flex', gap: '12px', color: 'var(--gray-400)' }}>
                <Heart size={18} style={{ cursor: 'pointer' }} />
                <button style={{ fontSize: '12px', fontWeight: 600 }}>Slow Mode: Off</button>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--gray-400)' }}>Be respectful in chat</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const X = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

export default Live;
