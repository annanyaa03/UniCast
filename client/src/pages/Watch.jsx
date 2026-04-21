import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ThumbsUp, ThumbsDown, Share2, Bookmark, Download,
  Flag, MoreHorizontal, Send, ChevronDown, ChevronUp,
} from 'lucide-react';
import { fetchVideo } from '../store/slices/videoSlice';
import VideoCard from '../components/common/VideoCard';
import { formatViews, formatRelativeTime, formatDate, formatDuration } from '../utils/formatters';

const MOCK_COMMENTS = Array.from({ length: 6 }, (_, i) => ({
  id: `c${i}`, author: ['Prof. Ranjit', 'Ananya S.', 'Rahul K.', 'Divya M.', 'Karan P.', 'Meera J.'][i],
  text: ['Great lecture! Helped me understand recursion finally.', 'The demo at 12:30 was really insightful.', 'Can you share the slide deck?', 'This should be pinned to the course playlist.', 'Excellent explanation of time complexity.', 'Looking forward to part 2!'][i],
  likes: [34, 12, 8, 21, 5, 9][i],
  time: new Date(Date.now() - i * 3600000 * 5).toISOString(),
}));

const MOCK_RELATED = Array.from({ length: 6 }, (_, i) => ({
  id: `rv${i}`, title: ['Sorting Algorithms Explained', 'Graph Theory Basics', 'Dynamic Programming', 'Trees & BST', 'Hash Tables', 'System Design Intro'][i],
  thumbnail: `https://picsum.photos/seed/rel${i}/640/360`,
  duration: 600 + i * 90, views: 3400 + i * 800,
  creator: { fullName: 'Prof. Sharma', id: 'prof-1' },
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
}));

const Watch = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentVideo, loading } = useSelector((s) => s.video);
  const { user } = useSelector((s) => s.auth);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [comment, setComment] = useState('');
  const [showDesc, setShowDesc] = useState(false);
  const [comments, setComments] = useState(MOCK_COMMENTS);

  useEffect(() => {
    dispatch(fetchVideo(id));
    window.scrollTo({ top: 0 });
  }, [id, dispatch]);

  const video = currentVideo || {
    id, title: 'Introduction to Data Structures & Algorithms',
    description: 'In this comprehensive lecture, we cover the fundamentals of data structures including arrays, linked lists, stacks, queues, and trees. This video is part of the CS101 curriculum.\n\nTopics covered:\n- Array operations and complexity\n- Singly and doubly linked lists\n- Stack and queue implementations\n- Binary trees and traversal\n\nTimestamps:\n0:00 - Introduction\n5:30 - Arrays\n18:00 - Linked Lists\n35:00 - Stacks & Queues\n52:00 - Trees',
    thumbnail: `https://picsum.photos/seed/${id}/1280/720`,
    views: 14200, likes: 438, dislikes: 12, duration: 3840,
    creator: { id: 'prof-1', fullName: 'Prof. Ranjit Sharma', username: 'prof_sharma' },
    category: 'education', tags: ['data structures', 'algorithms', 'cs101'],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setComments([{ id: `new-${Date.now()}`, author: user?.user_metadata?.full_name || 'You', text: comment, likes: 0, time: new Date().toISOString() }, ...comments]);
    setComment('');
  };

  return (
    <div className="page-pad--wide" style={{ padding: '20px 28px' }}>
      <div className="watch-layout">
        {/* Player + Info */}
        <div>
          {/* Video Player */}
          <div className="player-wrap">
            <img
              src={video.thumbnail}
              alt={video.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', aspectRatio: '16/9' }}
            />
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(0,0,0,0.3)',
            }}>
              <div style={{
                width: 64, height: 64, background: 'rgba(255,255,255,0.95)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--gray-900)">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              </div>
            </div>
          </div>

          {/* Video Info */}
          <div className="video-info" style={{ paddingTop: 16, marginTop: 0 }}>
            <h1 className="video-info__title">{video.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>
                {formatViews(video.views)} views · {formatDate(video.createdAt)}
              </div>
              <div className="video-actions">
                <button className={`action-btn ${liked ? 'active' : ''}`} onClick={() => setLiked(!liked)}>
                  <ThumbsUp size={15} /> {formatViews(video.likes + (liked ? 1 : 0))}
                </button>
                <button className="action-btn">
                  <ThumbsDown size={15} />
                </button>
                <button className="action-btn">
                  <Share2 size={15} /> Share
                </button>
                <button className={`action-btn ${saved ? 'active' : ''}`} onClick={() => setSaved(!saved)}>
                  <Bookmark size={15} /> {saved ? 'Saved' : 'Save'}
                </button>
                <button className="action-btn">
                  <Download size={15} />
                </button>
                <button className="action-btn">
                  <Flag size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Channel Info */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border)', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Link to={`/channel/${video.creator?.id}`}>
                <div style={{ width: 40, height: 40, background: 'var(--gray-900)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 16 }}>
                  {video.creator?.fullName?.charAt(0)}
                </div>
              </Link>
              <div>
                <Link to={`/channel/${video.creator?.id}`} style={{ display: 'block', fontWeight: 600, fontSize: 14, color: 'var(--gray-900)' }}>
                  {video.creator?.fullName}
                </Link>
                <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 1 }}>4.2K subscribers</div>
              </div>
            </div>
            <button className="btn btn--primary btn--sm">Subscribe</button>
          </div>

          {/* Description */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 13.5, color: 'var(--gray-700)', lineHeight: 1.7, whiteSpace: 'pre-line', maxHeight: showDesc ? 'none' : 80, overflow: 'hidden' }}>
              {video.description}
            </div>
            <button onClick={() => setShowDesc(!showDesc)} style={{ marginTop: 8, fontSize: 12.5, fontWeight: 600, color: 'var(--gray-600)', display: 'flex', alignItems: 'center', gap: 4 }}>
              {showDesc ? <><ChevronUp size={13} /> Show less</> : <><ChevronDown size={13} /> Show more</>}
            </button>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
              {video.tags?.map((t) => (
                <Link key={t} to={`/search?q=${t}`} style={{ fontSize: 12, color: 'var(--blue)', border: '1px solid var(--blue-light)', padding: '2px 10px', background: 'var(--blue-light)' }}>
                  #{t}
                </Link>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div>
            <div className="section-header" style={{ marginBottom: 20 }}>
              <span className="section-title">{comments.length} Comments</span>
              <select className="form-select" style={{ width: 'auto', height: 32, fontSize: 12, padding: '0 24px 0 10px' }}>
                <option>Top comments</option>
                <option>Newest first</option>
              </select>
            </div>

            {user && (
              <form onSubmit={handleComment} style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
                <div style={{ width: 34, height: 34, background: 'var(--gray-900)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                  {user?.user_metadata?.full_name?.charAt(0) || 'U'}
                </div>
                <div style={{ flex: 1, display: 'flex', gap: 8 }}>
                  <input
                    className="form-input"
                    style={{ flex: 1 }}
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button type="submit" className="btn btn--primary btn--sm" disabled={!comment.trim()}>
                    <Send size={13} />
                  </button>
                </div>
              </form>
            )}

            <div>
              {comments.map((c) => (
                <div key={c.id} className="comment">
                  <div className="comment__avatar">{c.author.charAt(0)}</div>
                  <div className="comment__body">
                    <div className="comment__header">
                      <span className="comment__author">{c.author}</span>
                      <span className="comment__time">{formatRelativeTime(c.time)}</span>
                    </div>
                    <div className="comment__text">{c.text}</div>
                    <div className="comment__actions">
                      <span className="comment__action"><ThumbsUp size={13} /> {c.likes}</span>
                      <span className="comment__action">Reply</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Videos Sidebar */}
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: 'var(--gray-900)' }}>Related Videos</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {MOCK_RELATED.map((v) => (
              <Link key={v.id} to={`/watch/${v.id}`} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 10 }}>
                <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: 'var(--gray-100)' }}>
                  <img src={v.thumbnail} alt={v.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span className="video-card__duration">{formatDuration(v.duration)}</span>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-900)', lineHeight: 1.4, marginBottom: 4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{v.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{v.creator.fullName}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--gray-400)', marginTop: 2 }}>{formatViews(v.views)} views</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watch;
