const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
      default: '',
    },
    tags: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
    category: {
      type: String,
      enum: ['education', 'cultural', 'sports', 'technical', 'events', 'clubs', 'general'],
      default: 'general',
    },
    videoUrl: {
      type: String,
      required: [true, 'Video URL is required'],
      default: '',
    },
    thumbnail: {
      type: String,
      default: '',
    },
    duration: {
      type: Number,
      default: 0,
      min: 0,
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Uploader is required'],
    },
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Club',
      default: null,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      default: null,
    },
    visibility: {
      type: String,
      enum: ['public', 'unlisted', 'private'],
      default: 'public',
    },
    isShort: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    processingStatus: {
      type: String,
      enum: ['queued', 'processing', 'completed', 'failed'],
      default: 'queued',
    },
    qualities: {
      hd: { type: String, default: null },
      sd: { type: String, default: null },
      low: { type: String, default: null },
    },
    chapters: [
      {
        title: { type: String, trim: true },
        timestamp: { type: Number, min: 0 },
      },
    ],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Text search index
videoSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Query performance indexes
videoSchema.index({ uploader: 1, createdAt: -1 });
videoSchema.index({ category: 1, createdAt: -1 });
videoSchema.index({ visibility: 1, createdAt: -1 });
videoSchema.index({ views: -1, createdAt: -1 });
videoSchema.index({ isShort: 1, createdAt: -1 });
videoSchema.index({ club: 1, createdAt: -1 });
videoSchema.index({ tags: 1 });
videoSchema.index({ visibility: 1, views: -1 });
videoSchema.index({ createdAt: -1 });
videoSchema.index({ isFeatured: 1 });

module.exports = mongoose.model('Video', videoSchema);
