import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Wifi, Film, BookOpen, Users, Calendar, Search, Star } from 'lucide-react';
import { DEPARTMENTS } from '../../data/departments';

const ENTCDepartment = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Videos');
  const dept = DEPARTMENTS.find(d => d.slug === 'entc');

  const tabs = ['Videos', 'Courses', 'Faculty', 'About'];

  return (
    <div className="dept-page" style={{ background: '#fff' }}>
      {/* TOP HEADER */}
      <div style={{ background: '#f9fafb', borderBottom: '1px solid #e4e4e7', padding: '24px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#6b7280' }}
              onClick={() => navigate('/departments')}
            >
              <ArrowLeft size={16} />
            </div>
            <div style={{ width: '44px', height: '44px', background: '#fff', border: '1px solid #e4e4e7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wifi size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', lineHeight: 1 }}>{dept.shortName}</h1>
              <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>{dept.name}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ background: '#fff', border: '1px solid #e4e4e7', padding: '8px 16px', fontSize: '13px', fontWeight: 600 }}>{dept.courses} Courses</div>
              <div style={{ background: '#fff', border: '1px solid #e4e4e7', padding: '8px 16px', fontSize: '13px', fontWeight: 600 }}>{dept.videos} Videos</div>
              <div style={{ background: '#fff', border: '1px solid #e4e4e7', padding: '8px 16px', fontSize: '13px', fontWeight: 600 }}>{dept.members} Members</div>
            </div>
            <button className="btn btn--primary btn--sm">Subscribe</button>
          </div>
        </div>
      </div>

      {/* METRICS ROW */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e4e4e7' }}>
        <div className="entc-metric-box">
          <Film className="entc-metric-icon" size={20} />
          <div className="entc-metric-number">{dept.videos}</div>
          <div className="entc-metric-label">Total Videos</div>
        </div>
        <div className="entc-metric-box">
          <BookOpen className="entc-metric-icon" size={20} />
          <div className="entc-metric-number">{dept.courses}</div>
          <div className="entc-metric-label">Total Courses</div>
        </div>
        <div className="entc-metric-box">
          <Users className="entc-metric-icon" size={20} />
          <div className="entc-metric-number">{dept.members}</div>
          <div className="entc-metric-label">Active Members</div>
        </div>
        <div className="entc-metric-box">
          <Calendar className="entc-metric-icon" size={20} />
          <div className="entc-metric-number">{dept.established}</div>
          <div className="entc-metric-label">Year Established</div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e4e4e7', padding: '0 32px', background: '#fff', position: 'sticky', top: '60px', zIndex: 10 }}>
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

      <div className="dept-page-content" style={{ padding: '32px' }}>
        {activeTab === 'Videos' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '32px' }}>
            <div>
               <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                {['All', 'Lectures', 'Lab Work', 'Seminars'].map(f => (
                  <div key={f} className={`dept-filter-chip ${f === 'All' ? 'active' : ''}`}>{f}</div>
                ))}
              </div>
              <div className="video-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                  <div key={i} className="mock-video-card">
                    <div className="mock-video-thumb">Video {i}</div>
                    <div className="mock-video-title">Electronics & Telecom Lecture Series {i}</div>
                    <div className="mock-video-meta">Prof. Patil • 950 views</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
               <div style={{ border: '1px solid #e4e4e7', padding: '24px', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Star size={16} fill="#ca8a04" color="#ca8a04" /> Top This Week
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[1, 2, 3, 4, 5].map(rank => (
                      <div key={rank} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <div style={{ fontSize: '18px', fontWeight: 800, color: '#e4e4e7', width: '20px' }}>{rank}</div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 600, lineHeight: 1.4 }}>VLSI Design Principles: Advanced Concepts</div>
                          <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>2.4k views</div>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>

               <div style={{ border: '1px solid #e4e4e7', padding: '24px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px' }}>Popular Topics</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {dept.topics.map(t => (
                      <span key={t} className="dept-topic-tag" style={{ margin: 0 }}>{t}</span>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'Courses' && (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Professor</th>
                  <th>Videos</th>
                  <th>Duration</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {dept.semesters.flatMap(s => s.courses.map(c => ({ ...c, sem: s.sem }))).map((course) => (
                  <tr key={course.code}>
                    <td>
                       <div style={{ fontWeight: 600 }}>{course.name}</div>
                       <div style={{ fontSize: '11px', color: '#9ca3af' }}>{course.code} • Sem {course.sem}</div>
                    </td>
                    <td>{course.professor}</td>
                    <td>{course.videos}</td>
                    <td>~15h</td>
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
              <div key={f.name} style={{ display: 'flex', alignItems: 'center', padding: '24px 0', borderBottom: '1px solid #f3f4f6' }}>
                 <div className="dept-initial-circle" style={{ width: '56px', height: '56px', fontSize: '20px', marginRight: '24px' }}>{f.name.charAt(4)}</div>
                 <div style={{ flex: 1 }}>
                   <div style={{ fontSize: '16px', fontWeight: 700 }}>{f.name}</div>
                   <div style={{ fontSize: '13px', color: '#6b7280' }}>{f.designation}</div>
                 </div>
                 <div style={{ width: '300px' }}>
                   <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>SUBJECTS</div>
                   <div style={{ fontSize: '13px', color: '#374151' }}>{f.specialty}, Digital Comm.</div>
                 </div>
                 <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', color: '#2563eb', fontWeight: 500 }}>{f.email}</div>
                    <button className="btn btn--ghost btn--sm" style={{ padding: 0, marginTop: '4px' }}>Contact Profile</button>
                 </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'About' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '60px' }}>
             <div>
                <h2 className="dept-section-heading">Department Profile</h2>
                <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: 1.8, marginBottom: '24px' }}>{dept.fullDescription}</p>
                <h2 className="dept-section-heading">Core Competencies</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {dept.topics.map(topic => (
                    <div key={topic} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', border: '1px solid #f3f4f6' }}>
                       <div style={{ width: '6px', height: '6px', background: '#2563eb' }}></div>
                       <span style={{ fontSize: '13px', fontWeight: 500 }}>{topic}</span>
                    </div>
                  ))}
                </div>
             </div>
             <div>
                <div className="dept-info-card" style={{ background: '#f9fafb', border: 'none' }}>
                   <div className="dept-info-card__title">Lab Facilities</div>
                   <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', listStyle: 'none', padding: 0 }}>
                      {['VLSI Design Lab', 'Embedded Systems Hub', 'Analog Communication Lab', 'Signal Processing Studio', 'Microprocessor Lab'].map(lab => (
                        <li key={lab} style={{ fontSize: '13px', color: '#4b5563', display: 'flex', justifyContent: 'space-between' }}>
                          {lab} <ChevronRight size={14} style={{ color: '#e4e4e7' }} />
                        </li>
                      ))}
                   </ul>
                </div>
                <div style={{ padding: '20px' }}>
                   <div style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '8px' }}>Location</div>
                   <div style={{ fontSize: '14px', fontWeight: 600 }}>{dept.location}</div>
                   <div style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', marginTop: '16px', marginBottom: '8px' }}>Email</div>
                   <div style={{ fontSize: '14px', fontWeight: 600 }}>{dept.email}</div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ENTCDepartment;
