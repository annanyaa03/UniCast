const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Temp storage for video uploads (processed by Bull queue)
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/temp');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `video-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// Memory storage for images (streamed directly to Cloudinary)
const imageStorage = multer.memoryStorage();

const videoFileFilter = (req, file, cb) => {
  const allowed = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/mpeg'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed (mp4, webm, mov, avi, mpeg)'), false);
  }
};

const imageFileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpg, png, gif, webp)'), false);
  }
};

// Video upload: max 500MB, stored on disk
const uploadVideo = multer({
  storage: videoStorage,
  fileFilter: videoFileFilter,
  limits: { fileSize: 500 * 1024 * 1024 },
});

// Image upload: max 5MB, stored in memory
const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = { uploadVideo, uploadImage };
