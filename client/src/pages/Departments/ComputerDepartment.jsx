import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Cpu, Users, Film, BookOpen, Calendar, MapPin, Mail, ChevronRight } from 'lucide-react';
import { DEPARTMENTS } from '../../data/departments';

const ComputerDepartment = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [activeSem, setActiveSem] = useState(1);
  const dept = DEPARTMENTS.find(d => d.slug === 'computer');

  const tabs = ['Overview', 'Videos', 'Courses', 'Faculty', 'About'];

  return (
    <div className="dept-page">
      {/* HERO SECTION */}
      <div className="dept-page-hero">
        <div style={{ display: 'flex', gap: '40px', maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ flex: 1 }}>
            <div className="dept-page-hero__back" onClick={() => navigate('/departments')}>
              <ArrowLeft size={16} /> Back to Departments
            </div>
            <div className="dept-page-hero__label">Department of Engineering</div>
            <h1 className="dept-page-hero__title">{dept.name}</h1>
            <p className="dept-page-hero__desc">{dept.fullDescription}</p>
            
            <div className="dept-page-stats">
              <div className="dept-page-stat">
                <span className="dept-page-stat__number">{dept.videos}</span>
                <span className="dept-page-stat__label">Videos</span>
              </div>
              <div className="dept-page-stat">
                <span className="dept-page-stat__number">{dept.members}</span>
                <span className="dept-page-stat__label">Members</span>
              </div>
              <div className="dept-page-stat">
                <span className="dept-page-stat__number">{dept.courses}</span>
                <span className="dept-page-stat__label">Courses</span>
              </div>
              <div className="dept-page-stat">
                <span className="dept-page-stat__number">{dept.established}</span>
                <span className="dept-page-stat__label">Est. Year</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn--primary" onClick={() => setActiveTab('Videos')}>Browse Videos</button>
              <button className="btn btn--outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }} onClick={() => setActiveTab('Courses')}>View Courses</button>
            </div>
          </div>

          <div style={{ width: '45%', position: 'relative', display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center' }}>
            <Cpu size={120} style={{ position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)', opacity: 0.04, color: '#fff' }} />
            
            <div className="dept-info-card" style={{ background: '#fff', marginBottom: 0 }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{dept.head}</div>
              <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase' }}>Head of Department</div>
            </div>
            <div className="dept-info-card" style={{ background: '#fff', marginBottom: 0 }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{dept.location}</div>
              <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase' }}>Location</div>
            </div>
            <div className="dept-info-card" style={{ background: '#fff', marginBottom: 0 }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{dept.email}</div>
              <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase' }}>Contact</div>
            </div>
          </div>
        </div>
      </div>

      {/* STICKY TABS */}
      <div className="dept-page-tabs">
        {tabs.map(tab => (
          <div 
            key={tab} 
            className={`dept-page-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      <div className="dept-page-content">
        {activeTab === 'Overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '48px' }}>
            <div>
              <h2 className="dept-section-heading">About the Department</h2>
              <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: 1.7, marginBottom: '24px' }}>{dept.fullDescription}</p>
              
              <h2 className="dept-section-heading">Topics Covered</h2>
              <div style={{ marginBottom: '32px' }}>
                {dept.topics.map(topic => (
                  <span key={topic} className="dept-topic-tag">{topic}</span>
                ))}
              </div>

              <h2 className="dept-section-heading">Recent Uploads</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="mock-video-card">
                    <div className="mock-video-thumb">Video {i}</div>
                    <div className="mock-video-title">Advanced {dept.topics[i]} Lecture</div>
                    <div className="mock-video-meta">Prof. Sharma • 1.2k views</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="dept-info-card">
                <div className="dept-info-card__title">Department Head</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div className="dept-initial-circle" style={{ width: '48px', height: '48px', fontSize: '18px' }}>RS</div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{dept.head}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{dept.email}</div>
                  </div>
                </div>
              </div>

              <div className="dept-info-card">
                <div className="dept-info-card__title">Quick Info</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '10px', fontSize: '13px', color: '#4b5563' }}><Calendar size={16} /> Established {dept.established}</div>
                  <div style={{ display: 'flex', gap: '10px', fontSize: '13px', color: '#4b5563' }}><MapPin size={16} /> {dept.location}</div>
                  <div style={{ display: 'flex', gap: '10px', fontSize: '13px', color: '#4b5563' }}><Mail size={16} /> {dept.email}</div>
                  <div style={{ display: 'flex', gap: '10px', fontSize: '13px', color: '#4b5563' }}><Users size={16} /> {dept.members} Students</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Videos' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['All', 'Lectures', 'Projects', 'Seminars', 'Shorts'].map(f => (
                  <div key={f} className={`dept-filter-chip ${f === 'All' ? 'active' : ''}`}>{f}</div>
                ))}
              </div>
              <select className="form-select" style={{ width: 'auto', height: '32px', fontSize: '12px' }}>
                <option>Latest</option>
                <option>Most Viewed</option>
                <option>Oldest</option>
              </select>
            </div>
            <div className="video-grid">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="mock-video-card">
                  <div className="mock-video-thumb">Video {i}</div>
                  <div className="mock-video-title">Computer Engineering Lecture Part {i}</div>
                  <div className="mock-video-meta">Prof. Sharma • 800 views • 2 days ago</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Courses' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                <span 
                  key={sem} 
                  className={`dept-sem-tab ${activeSem === sem ? 'active' : ''}`}
                  onClick={() => setActiveSem(sem)}
                >
                  Sem {sem}
                </span>
              ))}
            </div>
            <div>
              {(dept.semesters.find(s => s.sem === activeSem)?.courses || []).map(course => (
                <div key={course.code} className="dept-course-row">
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{course.code}</div>
                    <div style={{ fontWeight: 600 }}>{course.name}</div>
                  </div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="dept-initial-circle" style={{ width: '24px', height: '24px', fontSize: '10px' }}>{course.professor.charAt(4)}</div>
                    <div style={{ fontSize: '13px' }}>{course.professor}</div>
                  </div>
                  <div style={{ width: '100px', fontSize: '13px', color: '#6b7280' }}>{course.videos} Videos</div>
                  <button className="btn btn--outline btn--sm">View</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Faculty' && (
          <div className="video-grid">
            {dept.faculty.map(f => (
              <div key={f.name} className="dept-faculty-card">
                <div className="dept-initial-circle" style={{ width: '48px', height: '48px', marginBottom: '12px' }}>
                  {f.name.split(' ')[1].charAt(0)}{f.name.split(' ')[2]?.charAt(0)}
                </div>
                <div style={{ fontWeight: 700 }}>{f.name}</div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>{f.designation}</div>
                <div className="dept-topic-tag" style={{ margin: '0 0 12px 0' }}>{f.specialty}</div>
                <div style={{ fontSize: '12px', color: '#2563eb' }}>{f.email}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'About' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '48px' }}>
             <div>
                <h2 className="dept-section-heading">Vision & Mission</h2>
                <div style={{ borderLeft: '3px solid #111827', paddingLeft: '20px', marginBottom: '32px' }}>
                  <p style={{ fontStyle: 'italic', color: '#4b5563' }}>"To be a leading center of excellence in computer engineering education and research, producing globally competent professionals who contribute to society."</p>
                </div>
                <h2 className="dept-section-heading">Infrastructure</h2>
                <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: '#4b5563', fontSize: '14px' }}>
                  <li>Advanced Computing Lab</li>
                  <li>Artificial Intelligence Research Centre</li>
                  <li>Networking & Security Lab</li>
                  <li>Software Engineering Studio</li>
                </ul>
             </div>
             <div>
                <div className="dept-info-card">
                  <div className="dept-info-card__title">Contact Information</div>
                  <div style={{ fontSize: '13px', color: '#4b5563', lineHeight: 1.8 }}>
                    <strong>Office:</strong> {dept.location}<br/>
                    <strong>Phone:</strong> +91 123 456 7890<br/>
                    <strong>Email:</strong> {dept.email}
                  </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComputerDepartment;
