const Bull = require('bull');
const Video = require('../models/Video');
const cloudinary = require('../config/cloudinary');
const { notifyVideoReady } = require('../utils/notify');
const cache = require('../utils/cache');
const logger = require('../config/logger');
const fs = require('fs');

const videoQueue = new Bull('video-processing', {
  redis: process.env.REDIS_URL || 'redis://localhost:6379',
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: 100,
    removeOnFail: 50,
  },
});

// Process video jobs
videoQueue.process('process-video', async (job) => {
  const { videoId, filePath, uploaderId } = job.data;

  logger.info('Processing video job', { videoId, jobId: job.id });

  try {
    await Video.findByIdAndUpdate(videoId, { processingStatus: 'processing' });

    job.progress(10);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        filePath,
        {
          resource_type: 'video',
          folder: 'unicast/videos',
          public_id: `video_${videoId}`,
          eager: [
            { format: 'mp4', transformation: [{ quality: 'auto', width: 1280, height: 720, crop: 'limit' }] },
            { format: 'mp4', transformation: [{ quality: 'auto', width: 854, height: 480, crop: 'limit' }] },
            { format: 'mp4', transformation: [{ quality: 'auto', width: 640, height: 360, crop: 'limit' }] },
          ],
          eager_async: false,
          notification_url: null,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });

    job.progress(70);

    const thumbnailResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        filePath,
        {
          resource_type: 'video',
          folder: 'unicast/thumbnails',
          public_id: `thumb_${videoId}`,
          transformation: [
            { width: 1280, height: 720, crop: 'fill', so: '0' },
            { format: 'jpg', quality: 'auto' },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });

    job.progress(90);

    await Video.findByIdAndUpdate(videoId, {
      videoUrl: uploadResult.secure_url,
      thumbnail: thumbnailResult.secure_url,
      duration: Math.round(uploadResult.duration || 0),
      fileSize: uploadResult.bytes,
      processingStatus: 'completed',
      qualities: {
        hd: uploadResult.eager?.[0]?.secure_url,
        sd: uploadResult.eager?.[1]?.secure_url,
        low: uploadResult.eager?.[2]?.secure_url,
      },
    });

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      logger.info('Temp file deleted', { filePath });
    }

    await cache.delPattern('videos:feed:*');
    await cache.del(cache.keys.trending());

    const video = await Video.findById(videoId);
    if (video) {
      await notifyVideoReady(uploaderId, videoId, video.title);
    }

    job.progress(100);
    logger.info('Video processing completed', { videoId });
    return { success: true, videoId };
  } catch (err) {
    logger.error('Video processing failed', { videoId, error: err.message });

    await Video.findByIdAndUpdate(videoId, { processingStatus: 'failed' });

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    throw err;
  }
});

videoQueue.on('completed', (job, result) => {
  logger.info('Video job completed', { jobId: job.id, videoId: result.videoId });
});

videoQueue.on('failed', (job, err) => {
  logger.error('Video job failed', { jobId: job.id, error: err.message, attempts: job.attemptsMade });
});

videoQueue.on('stalled', (job) => {
  logger.warn('Video job stalled', { jobId: job.id });
});

module.exports = videoQueue;
