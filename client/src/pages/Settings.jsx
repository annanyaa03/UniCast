import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Bell, Shield, Lock, Trash2, Camera, Mail, Info, Globe, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profileForm, setProfileForm] = useState({
    fullName: user?.user_metadata?.full_name || '',
    username: user?.user_metadata?.username || '',
    bio: user?.user_metadata?.bio || '',
    department: user?.user_metadata?.department || '',
    year: user?.user_metadata?.year || '',
  });

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    toast.success('Profile updated successfully!');
  };

  return (
    <div className="page-pad--narrow">
      <h1 className="auth-title" style={{ marginBottom: '32px' }}>Settings</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '48px', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <button 
            className={`btn btn--sm ${activeTab === 'profile' ? 'btn--primary' : 'btn--ghost'}`}
            style={{ justifyContent: 'flex-start', gap: '12px', padding: '12px 16px' }}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} /> Profile
          </button>
          <button 
            className={`btn btn--sm ${activeTab === 'notifications' ? 'btn--primary' : 'btn--ghost'}`}
            style={{ justifyContent: 'flex-start', gap: '12px', padding: '12px 16px' }}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={18} /> Notifications
          </button>
          <button 
            className={`btn btn--sm ${activeTab === 'privacy' ? 'btn--primary' : 'btn--ghost'}`}
            style={{ justifyContent: 'flex-start', gap: '12px', padding: '12px 16px' }}
            onClick={() => setActiveTab('privacy')}
          >
            <Shield size={18} /> Privacy & Safety
          </button>
          <button 
            className={`btn btn--sm ${activeTab === 'account' ? 'btn--primary' : 'btn--ghost'}`}
            style={{ justifyContent: 'flex-start', gap: '12px', padding: '12px 16px' }}
            onClick={() => setActiveTab('account')}
          >
            <Lock size={18} /> Account Info
          </button>
        </div>

        <div style={{ padding: '32px', border: '1px solid var(--border)', background: 'var(--white)' }}>
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileUpdate}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: '80px', height: '80px', background: 'var(--gray-900)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '32px', fontWeight: 800 }}>
                    {profileForm.fullName.charAt(0)}
                  </div>
                  <button className="icon-btn" style={{ position: 'absolute', bottom: '-8px', right: '-8px', background: 'var(--white)', border: '1px solid var(--border)', width: '32px', height: '32px', color: 'var(--gray-900)' }}>
                    <Camera size={16} />
                  </button>
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>Profile Picture</h3>
                  <p style={{ fontSize: '13px', color: 'var(--gray-500)' }}>At least 200x200px. PNG or JPG.</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" className="form-input" 
                    value={profileForm.fullName} 
                    onChange={(e) => setProfileForm({...profileForm, fullName: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', background: 'var(--gray-50)' }}>
                    <span style={{ padding: '0 12px', color: 'var(--gray-400)', fontSize: '13px' }}>unicast.edu/</span>
                    <input 
                      type="text" className="form-input" style={{ border: 'none', background: 'transparent' }}
                      value={profileForm.username}
                      onChange={(e) => setProfileForm({...profileForm, username: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Bio</label>
                  <textarea 
                    className="form-textarea" 
                    placeholder="Tell viewers about yourself..."
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <input type="text" className="form-input" value={profileForm.department} readOnly style={{ background: 'var(--gray-50)', color: 'var(--gray-500)' }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Year of Study</label>
                    <input type="text" className="form-input" value={profileForm.year} readOnly style={{ background: 'var(--gray-50)', color: 'var(--gray-500)' }} />
                  </div>
                </div>

                <div style={{ marginTop: '12px' }}>
                  <button type="submit" className="btn btn--primary">Save Changes</button>
                </div>
              </div>
            </form>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '24px' }}>Notification Preferences</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[
                  { id: 'n1', label: 'Email Notifications', desc: 'Receive daily digests of new videos from your subscriptions.' },
                  { id: 'n2', label: 'Browser Notifications', desc: 'Get notified immediately when a creator goes live.' },
                  { id: 'n3', label: 'Channel Activity', desc: 'Notify me when someone comments on my video.' },
                  { id: 'n4', label: 'Club Updates', desc: 'Updates from clubs I have joined.' },
                ].map(n => (
                  <div key={n.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>{n.label}</p>
                      <p style={{ fontSize: '12px', color: 'var(--gray-500)', lineHeight: '1.5' }}>{n.desc}</p>
                    </div>
                    <div style={{ width: '40px', height: '20px', background: 'var(--gray-900)', borderRadius: '20px', position: 'relative', cursor: 'pointer' }}>
                       <div style={{ width: '16px', height: '16px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', right: '2px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '24px' }}>Account Information</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                 <div className="form-group">
                   <label className="form-label">Email Address</label>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                     <input type="email" className="form-input" value={user?.email} readOnly style={{ background: 'var(--gray-50)', color: 'var(--gray-500)' }} />
                     <span className="badge badge--green">Verified</span>
                   </div>
                 </div>

                 <div className="divider" style={{ margin: '12px 0' }} />

                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                   <div>
                     <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--red)' }}>Delete Account</p>
                     <p style={{ fontSize: '12px', color: 'var(--gray-500)', marginTop: '4px' }}>Permanently remove your account and all its data.</p>
                   </div>
                   <button className="btn btn--outline" style={{ color: 'var(--red)', borderColor: 'var(--red-light)' }}>
                     Delete Account
                   </button>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
