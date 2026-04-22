import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  User, Bell, Shield, Lock, Trash2, 
  Camera, Mail, Info, Globe, Smartphone,
  ChevronRight, CheckCircle, AlertCircle
} from 'lucide-react';
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

  const tabs = [
    { id: 'profile', label: 'Public Profile', icon: <User size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'privacy', label: 'Privacy & Safety', icon: <Shield size={18} /> },
    { id: 'account', label: 'Account Info', icon: <Lock size={18} /> },
  ];

  return (
    <div className="page-pad--narrow">
      <header style={{ marginBottom: '40px' }}>
        <h1 className="auth-title">Settings</h1>
        <p className="auth-subtitle" style={{ marginBottom: 0 }}>Manage your account settings and preferences.</p>
      </header>

      <div className="settings-container" style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '48px' }}>
        {/* Sidebar Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {tabs.map(tab => (
            <button 
              key={tab.id}
              className={`btn btn--sm ${activeTab === tab.id ? 'btn--primary' : 'btn--ghost'}`}
              style={{ justifyContent: 'flex-start', gap: '12px', padding: '12px 16px', border: 'none' }}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Content Area */}
        <main style={{ paddingBottom: '64px' }}>
          {activeTab === 'profile' && (
            <section className="settings-section">
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>Public Profile</h2>
              
              <form onSubmit={handleProfileUpdate} className="settings-form" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {/* Avatar Upload */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{ position: 'relative' }}>
                    <div className="avatar-btn__placeholder" style={{ width: '80px', height: '80px', fontSize: '32px' }}>
                      {profileForm.fullName.charAt(0) || user?.email?.charAt(0)}
                    </div>
                    <button type="button" className="icon-btn" style={{ 
                      position: 'absolute', bottom: '-4px', right: '-4px', 
                      background: 'var(--white)', border: '1px solid var(--border)',
                      width: '32px', height: '32px', borderRadius: '0'
                    }}>
                      <Camera size={16} />
                    </button>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>Profile Picture</h3>
                    <p style={{ fontSize: '12px', color: 'var(--gray-500)' }}>PNG or JPG. Max 2MB.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input 
                      type="text" className="form-input" 
                      value={profileForm.fullName} 
                      onChange={(e) => setProfileForm({...profileForm, fullName: e.target.value})}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Username</label>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)' }}>
                      <span style={{ padding: '0 12px', color: 'var(--gray-400)', fontSize: '13px', background: 'var(--gray-50)', height: '38px', display: 'flex', alignItems: 'center' }}>unicast.edu/</span>
                      <input 
                        type="text" className="form-input" style={{ border: 'none' }}
                        value={profileForm.username}
                        onChange={(e) => setProfileForm({...profileForm, username: e.target.value})}
                        placeholder="username"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Bio</label>
                    <textarea 
                      className="form-textarea" 
                      placeholder="Tell the campus about yourself..."
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                    />
                    <p className="form-hint">Brief description for your channel.</p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                      <label className="form-label">Department</label>
                      <input type="text" className="form-input" value={profileForm.department} readOnly style={{ background: 'var(--gray-50)', color: 'var(--gray-500)', cursor: 'not-allowed' }} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Year of Study</label>
                      <input type="text" className="form-input" value={profileForm.year} readOnly style={{ background: 'var(--gray-50)', color: 'var(--gray-500)', cursor: 'not-allowed' }} />
                    </div>
                  </div>
                </div>

                <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                  <button type="submit" className="btn btn--primary">Save Changes</button>
                </div>
              </form>
            </section>
          )}

          {activeTab === 'notifications' && (
            <section className="settings-section">
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>Notification Preferences</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {[
                  { id: 'email', label: 'Email Notifications', desc: 'New video digests and campus announcements.' },
                  { id: 'browser', label: 'Browser Notifications', desc: 'Real-time alerts for live streams and mentions.' },
                  { id: 'activity', label: 'Channel Activity', desc: 'Comments, likes, and subscription updates.' },
                  { id: 'clubs', label: 'Club Updates', desc: 'Important posts and events from joined clubs.' },
                ].map(n => (
                  <div key={n.id} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '32px' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>{n.label}</p>
                      <p style={{ fontSize: '13px', color: 'var(--gray-500)', lineHeight: '1.5' }}>{n.desc}</p>
                    </div>
                    <label className="switch" style={{ 
                      width: '44px', height: '24px', background: 'var(--gray-900)', 
                      display: 'block', position: 'relative', cursor: 'pointer' 
                    }}>
                      <input type="checkbox" defaultChecked style={{ display: 'none' }} />
                      <span style={{ 
                        position: 'absolute', top: '4px', right: '4px', 
                        width: '16px', height: '16px', background: 'var(--white)' 
                      }} />
                    </label>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'account' && (
            <section className="settings-section">
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>Account Information</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                      <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                      <input type="email" className="form-input" value={user?.email} readOnly style={{ paddingLeft: '40px', background: 'var(--gray-50)', color: 'var(--gray-500)' }} />
                    </div>
                    <span className="badge badge--green" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle size={10} /> Verified
                    </span>
                  </div>
                </div>

                <div style={{ padding: '24px', background: 'var(--red-light)', border: '1px solid #fee2e2' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--red)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={16} /> Danger Zone
                  </h3>
                  <p style={{ fontSize: '13px', color: '#991b1b', marginBottom: '20px', lineHeight: '1.6' }}>
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button className="btn btn--danger btn--sm">
                    Delete Account
                  </button>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .settings-section { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
};

export default Settings;
