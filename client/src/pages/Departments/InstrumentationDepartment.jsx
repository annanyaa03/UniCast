import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Settings, ChevronRight, Search, Mail, MapPin, ExternalLink } from 'lucide-react';
import { DEPARTMENTS } from '../../data/departments';

const InstrumentationDepartment = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const dept = DEPARTMENTS.find(d => d.slug === 'instrumentation');

  const menuItems = ['Overview', 'Videos', 'Courses', 'Faculty', 'Topics', 'Contact'];

  return (
    <div className="dept-page" style={{ background: '#fff', minHeight: '100vh' }}>
      {/* BREADCRUMB BAR */}
      <div style={{ height: '48px', borderBottom: '1px solid #e4e4e7', display: 'flex', alignItems: 'center', padding: '0 32px', fontSize: '12px', color: '#6b7280' }}>
         <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Home</span>
         <span style={{ margin: '0 8px' }}>&gt;</span>
         <span style={{ cursor: 'pointer' }} onClick={() => navigate('/departments')}>Departments</span>
         <span style={{ margin: '0 8px' }}>&gt;</span>
         <span style={{ color: '#111827', fontWeight: 600 }}>{dept.shortName}</span>
      </div>

      <div style={{ display: 'flex' }}>
        {/* LEFT NAV PANEL */}
        <div className="inst-left-nav">
           <div style={{ padding: '0 20px 24px' }}>
              <div style={{ width: '40px', height: '40px', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                 <Settings size={20} style={{ color: '#9ca3af' }} />
              </div>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{dept.shortName}</div>
           </div>

           <div style={{ display: 'flex', flexDirection: 'column' }}>
              {menuItems.map(item => (
                <div 
                  key={item} 
                  className={`inst-nav-item ${activeTab === item ? 'active' : ''}`}
                  onClick={() => setActiveTab(item)}
                >
                  {item}
                </div>
              ))}
           </div>

           <div style={{ padding: '32px 20px', marginTop: 'auto' }}>
              {[
                { label: 'Videos', val: dept.videos },
                { label: 'Courses', val: dept.courses },
                { label: 'Members', val: dept.members },
                { label: 'Est.', val: dept.established },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                   <span style={{ color: '#9ca3af' }}>{s.label}</span>
                   <span style={{ fontWeight: 600 }}>{s.val}</span>
                </div>
              ))}
           </div>
        </div>

        {/* RIGHT CONTENT */}
        <div style={{ flex: 1, padding: '48px 64px' }}>
          {activeTab === 'Overview' && (
            <div style={{ maxWidth: '900px' }}>
               <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', marginBottom: '12px' }}>{dept.name}</h1>
               <div style={{ width: '40px', height: '2px', background: '#111827', marginBottom: '32px' }}></div>
               
               <p style={{ fontSize: '16px', color: '#374151', lineHeight: 1.8, marginBottom: '40px' }}>
                  {dept.fullDescription}
               </p>

               <h2 className="dept-section-heading">Department Focus</h2>
               <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '48px' }}>
                  {dept.topics.map(t => (
                    <span key={t} className="dept-topic-tag" style={{ background: '#fff', border: '1px solid #e4e4e7', padding: '6px 14px' }}>{t}</span>
                  ))}
               </div>

               <h2 className="dept-section-heading">Featured Videos</h2>
               <div className="video-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="mock-video-card">
                       <div className="mock-video-thumb" style={{ height: '180px' }}>Lecture {i}</div>
                       <div className="mock-video-title">Instrumentation & Control Fundamentals - Part {i}</div>
                       <div className="mock-video-meta">Dr. Kavita Joshi • 640 views</div>
                    </div>
                  ))}
               </div>

               <div style={{ marginTop: '64px', border: '1px solid #e4e4e7', padding: '32px', display: 'flex', gap: '32px', alignItems: 'center' }}>
                  <div className="dept-initial-circle" style={{ width: '64px', height: '64px', fontSize: '24px' }}>KJ</div>
                  <div>
                     <div style={{ fontSize: '18px', fontWeight: 800 }}>Dr. Kavita Joshi</div>
                     <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Head of Department, Instrumentation & Control</div>
                     <p style={{ fontSize: '13px', color: '#4b5563', lineHeight: 1.5, marginBottom: '12px' }}>Leading the department since 2018 with a focus on industrial automation and precision measurement systems.</p>
                     <div style={{ fontSize: '13px', color: '#2563eb' }}>{dept.email}</div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'Videos' && (
            <div style={{ maxWidth: '900px' }}>
               <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                     <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                     <input className="form-input" style={{ paddingLeft: '40px', height: '44px' }} placeholder="Search videos in this department..." />
                  </div>
                  <button className="btn btn--primary">Search</button>
               </div>

               <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} style={{ display: 'flex', gap: '24px', padding: '24px 0', borderBottom: '1px solid #f3f4f6' }} className="mock-video-card">
                       <div style={{ width: '160px', height: '90px', background: '#f3f4f6', flexShrink: 0 }}></div>
                       <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>Advanced PLC Programming and Logic Design {i}</div>
                          <div style={{ fontSize: '13px', color: '#6b7280' }}>Dr. Anil Pawar • 1.1k views • 38:20 duration</div>
                          <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>Uploaded 2 weeks ago</div>
                       </div>
                       <ChevronRight size={18} style={{ alignSelf: 'center', color: '#e4e4e7' }} />
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'Courses' && (
            <div style={{ maxWidth: '800px' }}>
               <h2 className="dept-section-heading">Curriculum Overview</h2>
               <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {dept.semesters.flatMap(s => s.courses.map(c => ({ ...c, sem: s.sem }))).map((course, idx) => (
                    <div key={course.code} style={{ display: 'flex', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #f3f4f6' }}>
                       <div style={{ width: '40px', fontSize: '14px', color: '#9ca3af' }}>{idx + 1}</div>
                       <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: '15px' }}>{course.name}</div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>{course.code} • Prof. {course.professor}</div>
                       </div>
                       <div style={{ width: '100px', fontSize: '13px', color: '#6b7280' }}>Sem {course.sem}</div>
                       <div style={{ width: '80px', fontSize: '13px', color: '#6b7280' }}>{course.videos} vids</div>
                       <button className="btn btn--outline btn--sm">View</button>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'Faculty' && (
            <div style={{ maxWidth: '800px' }}>
               <h2 className="dept-section-heading">Faculty Members</h2>
               <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {dept.faculty.map(f => (
                    <div key={f.name} style={{ display: 'flex', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid #f3f4f6' }}>
                       <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: '15px' }}>{f.name}</div>
                          <div style={{ fontSize: '13px', color: '#6b7280' }}>{f.designation}</div>
                       </div>
                       <div style={{ width: '250px', fontSize: '13px', color: '#374151' }}>{f.specialty}</div>
                       <div style={{ fontSize: '13px', color: '#2563eb', cursor: 'pointer' }}>{f.email}</div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'Topics' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
               {dept.topics.map(t => (
                 <div key={t} className="inst-topic-card">
                    <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>{t}</div>
                    <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px', lineHeight: 1.6 }}>In-depth exploration of {t.toLowerCase()} including practical applications and industrial standards.</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <span style={{ fontSize: '12px', color: '#9ca3af' }}>12 related videos</span>
                       <button className="btn btn--outline btn--sm">Browse</button>
                    </div>
                 </div>
               ))}
            </div>
          )}

          {activeTab === 'Contact' && (
            <div style={{ maxWidth: '600px' }}>
               <h2 className="dept-section-heading">Get in Touch</h2>
               <div style={{ border: '1px solid #e4e4e7', padding: '32px' }}>
                  {[
                    { label: 'Department', val: dept.name },
                    { label: 'Head', val: dept.head },
                    { label: 'Email', val: dept.email },
                    { label: 'Location', val: dept.location },
                    { label: 'Office Hours', val: 'Mon-Fri, 9am - 5pm' },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', marginBottom: '20px', fontSize: '14px' }}>
                       <div style={{ width: '140px', color: '#9ca3af', fontWeight: 500 }}>{item.label}</div>
                       <div style={{ fontWeight: 600, color: '#111827' }}>{item.val}</div>
                    </div>
                  ))}
                  <button className="btn btn--primary btn--full" style={{ marginTop: '20px' }}>Send Message</button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstrumentationDepartment;
