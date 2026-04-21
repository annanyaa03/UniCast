import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';

dayjs.extend(relativeTime);
dayjs.extend(duration);

export const formatViews = (v) => {
  if (!v && v !== 0) return '0';
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return String(v);
};

export const formatDuration = (seconds) => {
  if (!seconds) return '0:00';
  const d = dayjs.duration(seconds, 'seconds');
  const h = Math.floor(d.asHours());
  const m = d.minutes();
  const s = d.seconds();
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
};

export const formatRelativeTime = (date) => dayjs(date).fromNow();
export const formatDate = (date, fmt = 'MMM D, YYYY') => dayjs(date).format(fmt);

export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const formatSubscribers = (count) => {
  if (!count) return '0 subscribers';
  if (count === 1) return '1 subscriber';
  return `${formatViews(count)} subscribers`;
};
