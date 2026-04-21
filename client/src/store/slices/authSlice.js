import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../services/supabase';

export const loginUser = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return rejectWithValue(error.message);
    localStorage.setItem('unicast_token', data.session.access_token);
    return { user: data.user, token: data.session.access_token };
  } catch (err) {
    return rejectWithValue(err.message || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/register', async ({ email, password, fullName, username, department, year }, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, username, department, year } },
    });
    if (error) return rejectWithValue(error.message);
    return data;
  } catch (err) {
    return rejectWithValue(err.message || 'Registration failed');
  }
});

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async (_, { rejectWithValue }) => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return rejectWithValue('Not authenticated');
    return user;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await supabase.auth.signOut();
  localStorage.removeItem('unicast_token');
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('unicast_token'),
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
    updateUser: (state, action) => { state.user = { ...state.user, ...action.payload }; },
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state) => { state.loading = false; })
      .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => { state.user = action.payload; state.loading = false; })
      .addCase(fetchCurrentUser.rejected, (state) => { state.token = null; state.user = null; state.loading = false; localStorage.removeItem('unicast_token'); })
      .addCase(logoutUser.fulfilled, (state) => { state.user = null; state.token = null; });
  },
});

export const { clearError, updateUser, setUser } = authSlice.actions;
export default authSlice.reducer;
