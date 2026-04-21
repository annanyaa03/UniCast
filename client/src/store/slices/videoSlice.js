import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Mock data for demonstration when API is not available
const MOCK_VIDEOS = Array.from({ length: 12 }, (_, i) => ({
  id: `vid-${i + 1}`,
  title: ['Introduction to Data Structures', 'College Fest 2024 Highlights', 'Robotics Club Demo Day', 'Guest Lecture: Machine Learning', 'Annual Sports Meet', 'Cultural Night Performance', 'Web Dev Workshop', 'Hackathon 2024 Winner Project'][i % 8],
  thumbnail: `https://picsum.photos/seed/${i + 10}/640/360`,
  duration: 300 + i * 120,
  views: (i + 1) * 1200 + Math.floor(Math.random() * 5000),
  likes: (i + 1) * 80,
  creator: { id: `user-${i}`, fullName: ['Prof. Sharma', 'Events Club', 'Robotics Club', 'CSE Dept', 'Sports Committee', 'Cultural Council', 'Tech Society', 'DEV Club'][i % 8], username: `user${i}` },
  category: ['education', 'cultural', 'technical', 'events', 'sports'][i % 5],
  createdAt: new Date(Date.now() - i * 86400000 * 3).toISOString(),
  isShort: i % 7 === 0,
}));

export const fetchFeed = createAsyncThunk('video/fetchFeed', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/videos', { params });
    return data;
  } catch {
    // Return mock data if API unavailable
    return { videos: MOCK_VIDEOS, hasMore: false };
  }
});

export const fetchTrending = createAsyncThunk('video/fetchTrending', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/videos/trending');
    return data;
  } catch {
    return { videos: MOCK_VIDEOS.slice(0, 6) };
  }
});

export const fetchVideo = createAsyncThunk('video/fetchVideo', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/videos/${id}`);
    return data;
  } catch {
    return MOCK_VIDEOS.find(v => v.id === id) || MOCK_VIDEOS[0];
  }
});

export const likeVideo = createAsyncThunk('video/likeVideo', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/videos/${id}/like`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const uploadVideo = createAsyncThunk('video/uploadVideo', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/videos/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Upload failed');
  }
});

const videoSlice = createSlice({
  name: 'video',
  initialState: {
    feed: [],
    trending: [],
    currentVideo: null,
    loading: false,
    feedLoading: false,
    error: null,
    hasMore: true,
    page: 1,
    uploadProgress: 0,
  },
  reducers: {
    clearCurrentVideo: (state) => { state.currentVideo = null; },
    setUploadProgress: (state, action) => { state.uploadProgress = action.payload; },
    resetFeed: (state) => { state.feed = []; state.page = 1; state.hasMore = true; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => { state.feedLoading = true; })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.feedLoading = false;
        state.feed = action.payload.page > 1 ? [...state.feed, ...action.payload.videos] : action.payload.videos;
        state.hasMore = action.payload.hasMore ?? false;
        state.page = (action.payload.page || 1) + 1;
      })
      .addCase(fetchFeed.rejected, (state, action) => { state.feedLoading = false; state.error = action.payload; })
      .addCase(fetchTrending.fulfilled, (state, action) => { state.trending = action.payload.videos || []; })
      .addCase(fetchVideo.pending, (state) => { state.loading = true; state.currentVideo = null; })
      .addCase(fetchVideo.fulfilled, (state, action) => { state.loading = false; state.currentVideo = action.payload; })
      .addCase(fetchVideo.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearCurrentVideo, setUploadProgress, resetFeed } = videoSlice.actions;
export default videoSlice.reducer;
