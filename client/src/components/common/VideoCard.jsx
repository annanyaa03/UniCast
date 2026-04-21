import React from 'react';
import { Link } from 'react-router-dom';
import { formatViews, formatRelativeTime, formatDuration } from '../../utils/formatters';

const VideoCard = ({ video, compact = false }) => {
  if (!video) return null;
  const thumb = video.thumbnail || `https://picsum.photos/seed/${video.id}/640/360`;
  const channelName = video.creator?.fullName || video.uploader?.fullName || 'Unknown';
  const channelId = video.creator?.id || video.uploader?.id || video.creator_id;

  return (
    <Link to={`/watch/${video.id}`} className="video-card">
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
        <Link
          to={`/channel/${channelId}`}
          className="video-card__channel"
          onClick={(e) => e.stopPropagation()}
        >
          {channelName}
        </Link>
        <div className="video-card__meta">
          <span>{formatViews(video.views)} views</span>
          <span style={{ color: 'var(--gray-300)' }}>·</span>
          <span>{formatRelativeTime(video.createdAt || video.created_at)}</span>
        </div>
      </div>
    </Link>
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
