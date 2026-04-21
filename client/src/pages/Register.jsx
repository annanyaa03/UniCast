import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import { registerUser } from '../store/slices/authSlice';

const schema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-zA-Z0-9_]+$/, 'Letters, numbers, underscores only'),
  email: z.string().email('Enter a valid email'),
  department: z.string().min(1, 'Select your department'),
  year: z.string().min(1, 'Select your year'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, { path: ['confirmPassword'], message: 'Passwords do not match' });

const DEPARTMENTS = ['Computer Science', 'Electronics & Communication', 'Mechanical', 'Civil', 'Electrical', 'Information Technology', 'Chemical', 'Biotechnology', 'Physics', 'Mathematics', 'MBA', 'Other'];
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'PhD'];

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((s) => s.auth);
  const [showPw, setShowPw] = useState(false);
  const [done, setDone] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    const result = await dispatch(registerUser({
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      username: data.username,
      department: data.department,
      year: data.year,
    }));
    if (registerUser.fulfilled.match(result)) {
      setDone(true);
    } else {
      toast.error(result.payload || 'Registration failed');
    }
  };

  if (done) {
    return (
      <div className="auth-page">
        <div className="auth-page__left" />
        <div className="auth-page__right">
          <div className="auth-box" style={{ textAlign: 'center' }}>
            <CheckCircle size={48} style={{ margin: '0 auto 20px', color: 'var(--green)' }} />
            <h1 className="auth-title">Check your email</h1>
            <p className="auth-subtitle">
              We sent a confirmation link to your email. Click it to activate your UniCast account.
            </p>
            <Link to="/login" className="btn btn--primary btn--full" style={{ marginTop: 24 }}>
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-page__left">
        <div>
          <div className="navbar__logo" style={{ color: '#fff', marginBottom: 40 }}>
            <div className="navbar__logo-mark"><span>UC</span></div>
            UniCast
          </div>
          <h2 style={{ color: '#fff', fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.35, marginBottom: 14 }}>
            Join your college community.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.7, maxWidth: 300 }}>
            Share your work, discover what others are creating, and be part of your campus story.
          </p>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 24 }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
            By joining, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>

      <div className="auth-page__right" style={{ alignItems: 'flex-start', paddingTop: 40 }}>
        <div className="auth-box" style={{ maxWidth: 460 }}>
          <div className="auth-logo">
            <div className="auth-logo-mark"><span>UC</span></div>
            <span className="auth-logo-text">UniCast</span>
          </div>

          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">Register with your official college email address.</p>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-fullname">Full Name</label>
                <input id="reg-fullname" type="text" className={`form-input ${errors.fullName ? 'error' : ''}`} placeholder="Your full name" {...register('fullName')} />
                {errors.fullName && <span className="form-error">{errors.fullName.message}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-username">Username</label>
                <input id="reg-username" type="text" className={`form-input ${errors.username ? 'error' : ''}`} placeholder="e.g. john_doe" {...register('username')} />
                {errors.username && <span className="form-error">{errors.username.message}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">College Email</label>
              <input id="reg-email" type="email" className={`form-input ${errors.email ? 'error' : ''}`} placeholder="you@college.edu" {...register('email')} />
              {errors.email && <span className="form-error">{errors.email.message}</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-dept">Department</label>
                <select id="reg-dept" className={`form-select ${errors.department ? 'error' : ''}`} {...register('department')}>
                  <option value="">Select department</option>
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                {errors.department && <span className="form-error">{errors.department.message}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-year">Year</label>
                <select id="reg-year" className={`form-select ${errors.year ? 'error' : ''}`} {...register('year')}>
                  <option value="">Select year</option>
                  {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
                {errors.year && <span className="form-error">{errors.year.message}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password</label>
              <div style={{ position: 'relative' }}>
                <input id="reg-password" type={showPw ? 'text' : 'password'} className={`form-input ${errors.password ? 'error' : ''}`} placeholder="Min. 8 characters" style={{ paddingRight: 40 }} {...register('password')} />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)', display: 'flex' }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-confirm">Confirm Password</label>
              <input id="reg-confirm" type="password" className={`form-input ${errors.confirmPassword ? 'error' : ''}`} placeholder="Repeat your password" {...register('confirmPassword')} />
              {errors.confirmPassword && <span className="form-error">{errors.confirmPassword.message}</span>}
            </div>

            <button type="submit" className={`btn btn--primary btn--full btn--lg ${loading ? 'btn--loading' : ''}`} disabled={loading} style={{ marginTop: 6 }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
