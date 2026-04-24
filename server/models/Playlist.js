const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Playlist title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: '',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required'],
    },
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
      },
    ],
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },
    thumbnail: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: videoCount
playlistSchema.virtual('videoCount').get(function () {
  return this.videos ? this.videos.length : 0;
});

// Pre-save: auto-set thumbnail from first video if not manually set
playlistSchema.pre('save', async function (next) {
  if (this.isModified('videos') && this.videos.length > 0 && !this.thumbnail) {
    try {
      const Video = mongoose.model('Video');
      const firstVideo = await Video.findById(this.videos[0]).select('thumbnail').lean();
      if (firstVideo && firstVideo.thumbnail) {
        this.thumbnail = firstVideo.thumbnail;
      }
    } catch {
      // Silently fail - thumbnail just won't be set
    }
  }
  next();
});

// Indexes
playlistSchema.index({ owner: 1, createdAt: -1 });
playlistSchema.index({ visibility: 1, createdAt: -1 });

module.exports = mongoose.model('Playlist', playlistSchema);
