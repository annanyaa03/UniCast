import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Database, Search, ChevronRight, Mail, MapPin, Calendar, Users } from 'lucide-react';
import { DEPARTMENTS } from '../../data/departments';

const ITDepartment = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const dept = DEPARTMENTS.find(d => d.slug === 'it');

  const menuItems = ['Overview', 'Videos', 'Courses', 'Faculty', 'About'];

  return (
    <div className="dept-page" style={{ background: '#fff', minHeight: '100vh' }}>
      {/* TOP BAR */}
      <div style={{ height: '56px', borderBottom: '1px solid #e4e4e7', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px' }}>
          <ArrowLeft size={16} style={{ cursor: 'pointer' }} onClick={() => navigate('/departments')} />
          <span style={{ color: '#6b7280' }}>Departments</span>
          <span style={{ color: '#e4e4e7' }}>/</span>
          <span style={{ fontWeight: 600 }}>{dept.name}</span>
        </div>
        <button className="btn btn--outline btn--sm">Subscribe to Updates</button>
      </div>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 56px)' }}>
        {/* LEFT SIDEBAR */}
        <div style={{ width: '260px', borderRight: '1px solid #e4e4e7', padding: '24px 0', position: 'sticky', top: '56px', height: 'fit-content' }}>
          <div style={{ padding: '0 24px 20px' }}>
            <div style={{ width: '48px', height: '48px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Database size={24} />
            </div>
            <div style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{dept.shortName}</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>{dept.head}, HOD</div>
          </div>
          
          <div style={{ borderTop: '1px solid #e4e4e7', padding: '16px 24px' }}>
            {[
              { label: 'Videos', val: dept.videos },
              { label: 'Courses', val: dept.courses },
              { label: 'Members', val: dept.members },
              { label: 'Founded', val: dept.established },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '12px', borderBottom: '1px solid #f9fafb' }}>
                <span style={{ color: '#6b7280' }}>{s.label}</span>
                <span style={{ fontWeight: 600 }}>{s.val}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '16px' }}>
            {menuItems.map(item => (
              <div 
                key={item}
                className={`it-sidebar-nav-item ${activeTab === item ? 'active' : ''}`}
                onClick={() => setActiveTab(item)}
              >
                {item}
              </div>
            ))}
          </div>

          <div style={{ padding: '24px', marginTop: 'auto' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', marginBottom: '12px', textTransform: 'uppercase' }}>Core Topics</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {dept.topics.map(t => (
                <div key={t} style={{ background: '#f9fafb', padding: '6px 10px', fontSize: '12px', color: '#374151', border: '1px solid #e4e4e7' }}>{t}</div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div style={{ flex: 1, padding: '40px' }}>
          {activeTab === 'Overview' && (
            <div>
              <div style={{ height: '180px', background: '#111827', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 40px', marginBottom: '40px' }}>
                <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>{dept.name}</h1>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>Networking. Security. Cloud. Data.</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '60px' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Mission</h2>
                  <div style={{ borderLeft: '3px solid #111827', paddingLeft: '24px', fontStyle: 'italic', color: '#4b5563', fontSize: '16px', lineHeight: 1.8 }}>
                    "To provide high-quality education in information technology, fostering innovation and preparing students for the dynamic digital landscape through practical learning and research."
                  </div>
                  <div style={{ marginTop: '40px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Featured Video</h2>
                    <div className="mock-video-card">
                       <div className="mock-video-thumb" style={{ height: '240px' }}>Featured Lecture</div>
                       <div className="mock-video-title" style={{ fontSize: '16px' }}>Intro to Cybersecurity & Threat Landscapes</div>
                       <div className="mock-video-meta">Dr. Priya Nair • 2.4k views</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Information</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <Calendar size={18} style={{ color: '#9ca3af' }} />
                      <div>
                        <div style={{ fontSize: '12px', color: '#9ca3af' }}>Established</div>
                        <div style={{ fontSize: '14px', fontWeight: 600 }}>{dept.established}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <MapPin size={18} style={{ color: '#9ca3af' }} />
                      <div>
                        <div style={{ fontSize: '12px', color: '#9ca3af' }}>Location</div>
                        <div style={{ fontSize: '14px', fontWeight: 600 }}>{dept.location}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <Mail size={18} style={{ color: '#9ca3af' }} />
                      <div>
                        <div style={{ fontSize: '12px', color: '#9ca3af' }}>Contact</div>
                        <div style={{ fontSize: '14px', fontWeight: 600 }}>{dept.email}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Videos' && (
            <div>
              <div style={{ position: 'relative', marginBottom: '32px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input className="form-input" style={{ paddingLeft: '40px' }} placeholder="Search IT department videos..." />
              </div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                {['All', 'Networking', 'Security', 'Cloud', 'IoT'].map(f => (
                  <div key={f} className={`dept-filter-chip ${f === 'All' ? 'active' : ''}`}>{f}</div>
                ))}
              </div>
              <div className="video-grid">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="mock-video-card">
                    <div className="mock-video-thumb">Video {i}</div>
                    <div className="mock-video-title">Information Technology Lecture {i}</div>
                    <div className="mock-video-meta">Prof. Kulkarni • 1.1k views</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Courses' && (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Course Name</th>
                    <th>Professor</th>
                    <th>Videos</th>
                    <th>Semester</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dept.semesters.flatMap(s => s.courses.map(c => ({ ...c, sem: s.sem }))).map((course, idx) => (
                    <tr key={course.code} style={{ background: idx % 2 === 0 ? 'transparent' : '#fafafa' }}>
                      <td style={{ fontWeight: 600 }}>{course.name}</td>
                      <td>{course.professor}</td>
                      <td>{course.videos}</td>
                      <td>Sem {course.sem}</td>
                      <td><button className="btn btn--outline btn--sm">View</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'Faculty' && (
            <div>
              {dept.faculty.map(f => (
                <div key={f.name} style={{ display: 'flex', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid #e4e4e7' }}>
                   <div className="dept-initial-circle" style={{ width: '48px', height: '48px', marginRight: '20px' }}>{f.name.charAt(4)}</div>
                   <div style={{ flex: 1 }}>
                     <div style={{ fontWeight: 700 }}>{f.name}</div>
                     <div style={{ fontSize: '13px', color: '#6b7280' }}>{f.designation}</div>
                   </div>
                   <div style={{ width: '200px' }}>
                     <span className="dept-topic-tag" style={{ margin: 0 }}>{f.specialty}</span>
                   </div>
                   <div style={{ fontSize: '13px', color: '#2563eb' }}>{f.email}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'About' && (
            <div>
              <h2 className="dept-section-heading">Detailed Description</h2>
              <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: 1.8, marginBottom: '32px' }}>{dept.fullDescription}</p>
              
              <h2 className="dept-section-heading">Infrastructure & Labs</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                {['Advanced Networking Lab', 'Cybersecurity Excellence Centre', 'Cloud Computing Sandbox', 'IoT Prototyping Hub'].map(lab => (
                  <div key={lab} style={{ padding: '16px', border: '1px solid #e4e4e7', display: 'flex', alignItems: 'center', gap: '12px' }}>
                     <div style={{ width: '8px', height: '8px', background: '#111827' }}></div>
                     <span style={{ fontSize: '14px', fontWeight: 500 }}>{lab}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ITDepartment;
