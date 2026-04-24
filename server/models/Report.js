const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reporter is required'],
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video',
      required: [true, 'Video reference is required'],
    },
    reason: {
      type: String,
      enum: ['spam', 'inappropriate', 'misinformation', 'harassment', 'copyright', 'other'],
      required: [true, 'Reason is required'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'dismissed', 'actioned'],
      default: 'pending',
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
reportSchema.index({ status: 1, createdAt: -1 });
reportSchema.index({ video: 1, reporter: 1 }, { unique: true }); // Prevent duplicate reports
reportSchema.index({ reporter: 1, createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema);
