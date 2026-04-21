import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { Upload as UploadIcon, X, Film, Image as ImageIcon, Check } from 'lucide-react';
import { uploadVideo, setUploadProgress } from '../store/slices/videoSlice';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  description: z.string().max(1000).optional(),
  category: z.string().min(1, 'Please select a category'),
  visibility: z.enum(['public', 'unlisted', 'private']),
  tags: z.string().optional(),
});

const CATEGORIES = ['Education', 'Cultural', 'Sports', 'Technical', 'Events', 'Clubs', 'General'];

const Upload = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { uploadProgress } = useSelector((state) => state.video);
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { visibility: 'public', category: 'General' }
  });

  const onDropVideo = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
    } else {
      toast.error('Please upload a valid video file');
    }
  }, []);

  const onDropThumbnail = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith('image/')) {
      setThumbnailFile(file);
    } else {
      toast.error('Please upload a valid image file');
    }
  }, []);

  const { getRootProps: getVideoProps, getInputProps: getVideoInput, isDragActive: isVideoActive } = useDropzone({
    onDrop: onDropVideo,
    accept: { 'video/*': [] },
    multiple: false
  });

  const { getRootProps: getThumbProps, getInputProps: getThumbInput, isDragActive: isThumbActive } = useDropzone({
    onDrop: onDropThumbnail,
    accept: { 'image/*': [] },
    multiple: false
  });

  const onSubmit = async (data) => {
    if (!videoFile) {
      toast.error('Please select a video to upload');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('video', videoFile);
    if (thumbnailFile) formData.append('thumbnail', thumbnailFile);
    formData.append('title', data.title);
    formData.append('description', data.description || '');
    formData.append('category', data.category.toLowerCase());
    formData.append('visibility', data.visibility);
    formData.append('tags', data.tags || '');

    const result = await dispatch(uploadVideo(formData));
    setIsUploading(false);
    dispatch(setUploadProgress(0));

    if (uploadVideo.fulfilled.match(result)) {
      toast.success('Video uploaded successfully!');
      navigate(`/watch/${result.payload.id || ''}`);
    } else {
      toast.error(result.payload || 'Failed to upload video');
    }
  };

  return (
    <div className="page-pad">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 className="auth-title" style={{ marginBottom: '24px' }}>Upload Video</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {!videoFile ? (
                <div {...getVideoProps()} className={`dropzone ${isVideoActive ? 'active' : ''}`}>
                  <input {...getVideoInput()} />
                  <div className="dropzone__icon"><UploadIcon size={48} /></div>
                  <p className="dropzone__title">Drag & drop a video file to upload</p>
                  <p className="dropzone__sub">Your videos will be private until you publish them.</p>
                  <button type="button" className="btn btn--primary" style={{ marginTop: '16px' }}>Select File</button>
                </div>
              ) : (
                <div style={{ padding: '24px', border: '1px solid var(--border)', background: 'var(--gray-50)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', background: 'var(--gray-200)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'var(--gray-600)' }}>
                    <Film size={24} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{videoFile.name}</p>
                    <p style={{ fontSize: '12px', color: 'var(--gray-500)' }}>{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                  <button type="button" onClick={() => setVideoFile(null)} className="icon-btn" style={{ color: 'var(--red)' }}><X size={20} /></button>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Title (required)</label>
                <input
                  type="text"
                  className={`form-input ${errors.title ? 'error' : ''}`}
                  placeholder="Add a title that describes your video"
                  {...register('title')}
                />
                {errors.title && <p className="form-error">{errors.title.message}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className={`form-textarea ${errors.description ? 'error' : ''}`}
                  placeholder="Tell viewers about your video"
                  {...register('description')}
                />
                {errors.description && <p className="form-error">{errors.description.message}</p>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" {...register('category')}>
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Visibility</label>
                  <select className="form-select" {...register('visibility')}>
                    <option value="public">Public</option>
                    <option value="unlisted">Unlisted</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Tags (comma separated)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. lecture, computer science, 2024"
                  {...register('tags')}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Thumbnail</label>
                <div {...getThumbProps()} className={`dropzone ${isThumbActive ? 'active' : ''}`} style={{ padding: '24px', aspectRatio: '16/9' }}>
                  <input {...getThumbInput()} />
                  {thumbnailFile ? (
                    <img
                      src={URL.createObjectURL(thumbnailFile)}
                      alt="Thumbnail preview"
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--gray-400)' }}>
                      <ImageIcon size={32} />
                      <p style={{ fontSize: '11px', marginTop: '8px' }}>Upload thumbnail</p>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ padding: '20px', border: '1px solid var(--border)', background: 'var(--gray-50)' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>Upload Checklist</h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: videoFile ? 'var(--green)' : 'var(--gray-400)' }}>
                    <Check size={14} /> Video file selected
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: watch('title')?.length >= 5 ? 'var(--green)' : 'var(--gray-400)' }}>
                    <Check size={14} /> Valid title provided
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: thumbnailFile ? 'var(--green)' : 'var(--gray-400)' }}>
                    <Check size={14} /> Thumbnail uploaded
                  </li>
                </ul>
              </div>

              {isUploading && (
                <div style={{ marginTop: 'auto' }}>
                  <p style={{ fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>Uploading... {uploadProgress}%</p>
                  <div className="progress-bar">
                    <div className="progress-bar__fill" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className={`btn btn--primary btn--full btn--lg ${isUploading ? 'btn--loading' : ''}`}
                disabled={isUploading || !videoFile}
                style={{ marginTop: isUploading ? '16px' : 'auto' }}
              >
                {isUploading ? 'Uploading...' : 'Publish Video'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Upload;
