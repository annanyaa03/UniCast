import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { loginUser } from '../store/slices/authSlice';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((s) => s.auth);
  const [showPw, setShowPw] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      toast.success('Welcome back!');
      navigate('/');
    } else {
      toast.error(result.payload || 'Login failed');
    }
  };

  return (
    <div className="auth-page">
      {/* Left Panel */}
      <div className="auth-page__left">
        <div>
          <div className="navbar__logo" style={{ color: '#fff', marginBottom: 40 }}>
            <div className="navbar__logo-mark"><span>UC</span></div>
            UniCast
          </div>
          <h2 style={{ color: '#fff', fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.3, marginBottom: 16 }}>
            Your campus,<br />on one screen.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.7, maxWidth: 320 }}>
            Watch lectures, club events, fests, sports, and everything your college creates — all in one place.
          </p>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 24 }}>
          <div style={{ display: 'flex', gap: 24 }}>
            {[['370+', 'Platform Features'], ['50+', 'Active Clubs'], ['24/7', 'Live Streaming']].map(([num, label]) => (
              <div key={label}>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: 20, letterSpacing: '-0.03em' }}>{num}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-page__right">
        <div className="auth-box">
          <div className="auth-logo">
            <div className="auth-logo-mark"><span>UC</span></div>
            <span className="auth-logo-text">UniCast</span>
          </div>

          <h1 className="auth-title">Sign in</h1>
          <p className="auth-subtitle">Use your college email to sign in to your account.</p>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="you@college.edu"
                {...register('email')}
              />
              {errors.email && <span className="form-error">{errors.email.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPw ? 'text' : 'password'}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Your password"
                  style={{ paddingRight: 40 }}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)', display: 'flex' }}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password.message}</span>}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -8 }}>
              <Link to="/forgot-password" style={{ fontSize: 12.5, color: 'var(--gray-600)' }}>Forgot password?</Link>
            </div>

            <button
              type="submit"
              className={`btn btn--primary btn--full btn--lg ${loading ? 'btn--loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                  Signing in...
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  Sign In <ArrowRight size={15} />
                </span>
              )}
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account?{' '}
            <Link to="/register">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
