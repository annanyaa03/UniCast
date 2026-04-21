import React from 'react';
import { useSelector } from 'react-redux';
import { 
  Users, Video, Shield, BarChart3, AlertTriangle, 
  CheckCircle, XCircle, MoreVertical, Search, Filter 
} from 'lucide-react';
import { formatViews } from '../utils/formatters';

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Users', value: '1,240', change: '+12%', icon: <Users size={20} />, color: 'var(--blue)' },
    { label: 'Videos Hosted', value: '850', change: '+8%', icon: <Video size={20} />, color: 'var(--green)' },
    { label: 'Active Reports', value: '14', change: '-2', icon: <AlertTriangle size={20} />, color: 'var(--red)' },
    { label: 'Avg. Daily Views', value: '4.2K', change: '+15%', icon: <BarChart3 size={20} />, color: 'var(--yellow)' },
  ];

  return (
    <div className="page-pad">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 className="auth-title" style={{ marginBottom: '8px' }}>Admin Dashboard</h1>
          <p className="auth-subtitle" style={{ marginBottom: 0 }}>Overview and platform management.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn--outline">System Logs</button>
          <button className="btn btn--primary">Platform Settings</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {stats.map(stat => (
          <div key={stat.label} className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ padding: '8px', background: `${stat.color}10`, color: stat.color }}>{stat.icon}</div>
              <span className={`stat-card__change ${stat.change.startsWith('-') ? 'stat-card__change--down' : ''}`}>{stat.change}</span>
            </div>
            <p className="stat-card__label">{stat.label}</p>
            <p className="stat-card__value">{stat.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
             <h3 className="section-title">Pending Moderation</h3>
             <div style={{ display: 'flex', gap: '8px' }}>
                <div className="search-bar" style={{ width: '200px' }}>
                  <div className="search-bar__wrap" style={{ height: '32px' }}>
                    <Search size={12} className="search-bar__icon" />
                    <input className="search-bar__input" placeholder="Search..." style={{ fontSize: '12px' }} />
                  </div>
                </div>
                <button className="icon-btn" style={{ height: '32px', width: '32px', border: '1px solid var(--border)' }}><Filter size={14} /></button>
             </div>
          </div>

          <div style={{ border: '1px solid var(--border)', background: 'var(--white)' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Content</th>
                  <th>Uploader</th>
                  <th>Reports</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 1, title: 'Exam Leaks Part 2', user: 'anonymous_user', reports: 12, status: 'Flagged' },
                  { id: 2, title: 'Inappropriate Content #1', user: 'user_99', reports: 5, status: 'Pending' },
                  { id: 3, title: 'Clubs Promotion Video', user: 'tech_society', reports: 2, status: 'Pending' },
                  { id: 4, title: 'Offensive Language Demo', user: 'joker_42', reports: 8, status: 'Flagged' },
                  { id: 5, title: 'Copyright Material', user: 'uploader_x', reports: 3, status: 'Pending' },
                ].map(row => (
                  <tr key={row.id}>
                    <td>
                      <p style={{ fontWeight: 600, fontSize: '13px' }}>{row.title}</p>
                      <p style={{ fontSize: '11px', color: 'var(--gray-400)', marginTop: '2px' }}>ID: vid_002_{row.id}</p>
                    </td>
                    <td style={{ fontSize: '13px' }}>@{row.user}</td>
                    <td><span style={{ color: row.reports > 5 ? 'var(--red)' : 'var(--gray-900)', fontWeight: 700 }}>{row.reports}</span></td>
                    <td>
                      <span className={`badge ${row.status === 'Flagged' ? 'badge--red' : 'badge--yellow'}`}>{row.status}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="icon-btn" style={{ color: 'var(--green)' }}><CheckCircle size={16} /></button>
                        <button className="icon-btn" style={{ color: 'var(--red)' }}><XCircle size={16} /></button>
                        <button className="icon-btn"><MoreVertical size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="section-title" style={{ marginBottom: '20px' }}>System Health</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { label: 'Database', status: 'Healthy', color: 'var(--green)' },
              { label: 'Video Encoding Cluster', status: 'Running', color: 'var(--green)' },
              { label: 'Storage Service', status: 'Healthy', color: 'var(--green)' },
              { label: 'Socket Cluster', status: 'High Load', color: 'var(--yellow)' },
            ].map(sys => (
              <div key={sys.label} style={{ padding: '16px', border: '1px solid var(--border)', background: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 600 }}>{sys.label}</p>
                  <p style={{ fontSize: '11px', color: 'var(--gray-400)', marginTop: '2px' }}>Last check: 2 mins ago</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: sys.color }} />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: sys.color }}>{sys.status}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '32px', padding: '20px', background: 'var(--gray-900)', color: '#fff' }}>
             <p style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>Server Info</p>
             <p style={{ fontSize: '14px', marginBottom: '12px' }}>unicast-prod-cluster-01</p>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                  <span>CPU Usage</span>
                  <span>42%</span>
                </div>
                <div className="progress-bar" style={{ height: '3px', background: 'rgba(255,255,255,0.1)' }}>
                  <div className="progress-bar__fill" style={{ width: '42%', background: '#fff' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginTop: '4px' }}>
                  <span>RAM Usage</span>
                  <span>68%</span>
                </div>
                <div className="progress-bar" style={{ height: '3px', background: 'rgba(255,255,255,0.1)' }}>
                  <div className="progress-bar__fill" style={{ width: '68%', background: '#fff' }} />
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
