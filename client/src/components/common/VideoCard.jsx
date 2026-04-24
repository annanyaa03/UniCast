import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatViews, formatRelativeTime, formatDuration } from '../../utils/formatters';

const VideoCard = ({ video, compact = false }) => {
  const navigate = useNavigate();
  if (!video) return null;
  const thumb = video.thumbnail || `https://picsum.photos/seed/${video.id || video._id}/640/360`;
  const channelName = video.creator?.fullName || video.uploader?.fullName || 'Unknown';
  const channelId = video.creator?.id || video.uploader?.id || video.uploader?._id || video.creator_id;
  const videoId = video.id || video._id;

  const handleCardClick = () => {
    navigate(`/watch/${videoId}`);
  };

  const handleChannelClick = (e) => {
    e.stopPropagation();
    navigate(`/channel/${channelId}`);
  };

  return (
    <div className="video-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="video-card__thumb">
        <img src={thumb} alt={video.title} loading="lazy" />
        {video.duration && (
          <span className="video-card__duration">{formatDuration(video.duration)}</span>
        )}
        {video.isLive && (
          <span className="video-card__duration" style={{ background: 'var(--red)' }}>LIVE</span>
        )}
      </div>
      <div className="video-card__body">
        <div className="video-card__title">{video.title}</div>
        <div
          className="video-card__channel"
          onClick={handleChannelClick}
          style={{ cursor: 'pointer', display: 'inline-block' }}
        >
          {channelName}
        </div>
        <div className="video-card__meta">
          <span>{formatViews(video.views || video.views_count)} views</span>
          <span style={{ color: 'var(--gray-300)' }}>·</span>
          <span>{formatRelativeTime(video.createdAt || video.created_at)}</span>
        </div>
      </div>
    </div>
  );
};

export const VideoCardSkeleton = () => (
  <div className="video-card">
    <div className="skeleton" style={{ aspectRatio: '16/9', width: '100%' }} />
    <div className="video-card__body">
      <div className="skeleton" style={{ height: 14, width: '90%', marginBottom: 6 }} />
      <div className="skeleton" style={{ height: 12, width: '60%', marginBottom: 4 }} />
      <div className="skeleton" style={{ height: 11, width: '40%' }} />
    </div>
  </div>
);

export default VideoCard;
