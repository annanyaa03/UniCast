import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ─── ASYNC THUNKS ───────────────────────────────────────────

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/register', {
        fullName: userData.fullName,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        department: userData.department,
        year: parseInt(userData.year),
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Registration failed. Please try again.'
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/login', {
        email: credentials.email,
        password: credentials.password,
      });
      localStorage.setItem('unicast_token', data.accessToken);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/users/me');
      return data;
    } catch (err) {
      localStorage.removeItem('unicast_token');
      return rejectWithValue(
        err.response?.data?.message || 'Session expired. Please login again.'
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    try {
      await api.post('/auth/logout');
    } catch {}
    localStorage.removeItem('unicast_token');
  }
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'OTP verification failed.'
      );
    }
  }
);

// ─── SLICE ──────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('unicast_token') || null,
    loading: false,
    error: null,
    registered: false,
    otpRequired: false,
    registeredEmail: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearRegistered: (state) => {
      state.registered = false;
      state.otpRequired = false;
      state.registeredEmail = null;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.registered = true;
        state.otpRequired = action.payload.otpRequired || false;
        state.registeredEmail = action.payload.email || null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch current user
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.error = null;
      })

      // Verify OTP
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.accessToken) {
          state.token = action.payload.accessToken;
          state.user = action.payload.user;
          localStorage.setItem('unicast_token', action.payload.accessToken);
        }
        state.otpRequired = false;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearRegistered, updateUser, setToken } = authSlice.actions;
export default authSlice.reducer;
