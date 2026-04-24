import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Zap, Users, BookOpen, Film, ChevronDown, ChevronUp, Mail, ExternalLink } from 'lucide-react';
import { DEPARTMENTS } from '../../data/departments';

const ElectricalDepartment = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Videos');
  const [openSem, setOpenSem] = useState(null);
  const dept = DEPARTMENTS.find(d => d.slug === 'electrical');

  const tabs = ['Videos', 'Courses', 'Research', 'Faculty', 'About'];

  const toggleSem = (sem) => {
    setOpenSem(openSem === sem ? null : sem);
  };

  return (
    <div className="dept-page" style={{ background: '#fff' }}>
      {/* HERO SECTION - TIMELINE STYLE */}
      <div style={{ background: '#fafafa', borderBottom: '1px solid #e4e4e7', padding: '64px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', maxWidth: '1400px', margin: '0 auto' }}>
          <div>
            <div 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#6b7280', marginBottom: '32px' }}
              onClick={() => navigate('/departments')}
            >
              <ArrowLeft size={16} /> Back to Departments
            </div>
            <div style={{ width: '48px', height: '48px', background: '#111827', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <Zap size={24} fill="#fff" />
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', marginBottom: '16px' }}>{dept.name}</h1>
            <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: 1.7, marginBottom: '32px', maxWidth: '480px' }}>{dept.description}</p>
            
            <div style={{ display: 'flex', gap: '40px', marginBottom: '32px' }}>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 800 }}>{dept.videos}</div>
                <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Videos</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 800 }}>{dept.members}</div>
                <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Members</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 800 }}>{dept.courses}</div>
                <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Courses</div>
              </div>
            </div>

            <button className="btn btn--primary" onClick={() => setActiveTab('Videos')}>Browse Videos</button>
          </div>

          <div style={{ paddingLeft: '40px', borderLeft: '1px solid #e4e4e7' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '24px', letterSpacing: '0.1em' }}>Department Milestones</div>
            <div className="electrical-timeline">
               {dept.milestones.map((m, idx) => (
                 <div key={m.year} className="electrical-timeline-item">
                    <div className="electrical-timeline-dot"></div>
                    <div className="electrical-timeline-year">{m.year}</div>
                    <div className="electrical-timeline-label">{m.label}</div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e4e4e7', padding: '0 40px', background: '#fff', position: 'sticky', top: '60px', zIndex: 10 }}>
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

      <div className="dept-page-content" style={{ padding: '40px' }}>
        {activeTab === 'Videos' && (
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
              {['All', 'Power Systems', 'Machines', 'Control', 'Renewable'].map(f => (
                <div key={f} className={`dept-filter-chip ${f === 'All' ? 'active' : ''}`}>{f}</div>
              ))}
            </div>
            <div className="video-grid">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="mock-video-card">
                  <div className="mock-video-thumb">Video {i}</div>
                  <div className="mock-video-title">Electrical Engineering: Module {i}</div>
                  <div className="mock-video-meta">Prof. Mohan Desai • 1.5k views</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Courses' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[1, 2, 3].map(sem => (
              <div key={sem}>
                <div 
                  className={`accordion-header ${openSem === sem ? 'open' : ''}`}
                  onClick={() => toggleSem(sem)}
                >
                  Semester {sem}
                  {openSem === sem ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
                {openSem === sem && (
                  <div className="accordion-content">
                    {dept.semesters.find(s => s.sem === sem).courses.map(course => (
                      <div key={course.code} className="dept-course-row" style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '11px', color: '#9ca3af' }}>{course.code}</div>
                          <div style={{ fontWeight: 600 }}>{course.name}</div>
                        </div>
                        <div style={{ flex: 1, fontSize: '13px', color: '#4b5563' }}>Prof. {course.professor}</div>
                        <div style={{ width: '100px', fontSize: '12px', color: '#9ca3af' }}>{course.videos} Videos</div>
                        <button className="btn btn--outline btn--sm">Access</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Research' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {[
              { title: 'Smart Grid Optimization using AI', lead: 'Dr. Mohan Desai', students: 4, status: 'Ongoing' },
              { title: 'Renewable Energy Integration in Campus', lead: 'Dr. Sanjay Kulkarni', students: 6, status: 'Completed' },
              { title: 'High Voltage Testing Procedures', lead: 'Dr. Mohan Desai', students: 2, status: 'Ongoing' },
              { title: 'Power Electronics in Electric Vehicles', lead: 'Dr. Rakesh Sharma', students: 5, status: 'Ongoing' },
            ].map((p, idx) => (
              <div key={idx} style={{ padding: '24px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                   <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>{p.title}</div>
                   <div style={{ fontSize: '13px', color: '#6b7280' }}>Lead: {p.lead} • Students: {p.students}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span className={`badge ${p.status === 'Ongoing' ? 'badge--green' : 'badge--gray'}`} style={{ textTransform: 'uppercase', fontSize: '10px' }}>{p.status}</span>
                  <ExternalLink size={16} style={{ color: '#9ca3af', cursor: 'pointer' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Faculty' && (
          <div className="table-wrap">
            <table className="data-table">
               <thead>
                  <tr>
                    <th>Name</th>
                    <th>Designation</th>
                    <th>Specialization</th>
                    <th>Experience</th>
                    <th>Contact</th>
                  </tr>
               </thead>
               <tbody>
                  {dept.faculty.map(f => (
                    <tr key={f.name}>
                       <td style={{ fontWeight: 600 }}>{f.name}</td>
                       <td style={{ fontSize: '12px', color: '#6b7280' }}>{f.designation}</td>
                       <td><span className="dept-topic-tag" style={{ margin: 0 }}>{f.specialty}</span></td>
                       <td>12+ Years</td>
                       <td><div style={{ fontSize: '12px', color: '#2563eb' }}>{f.email}</div></td>
                    </tr>
                  ))}
               </tbody>
            </table>
          </div>
        )}

        {activeTab === 'About' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '60px' }}>
             <div>
                <h2 className="dept-section-heading">About the Department</h2>
                <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: 1.8, marginBottom: '32px' }}>{dept.fullDescription}</p>
                
                <div style={{ borderLeft: '3px solid #111827', paddingLeft: '24px', marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>Vision</h3>
                  <p style={{ fontStyle: 'italic', color: '#6b7280' }}>"To empower students with cutting-edge knowledge in electrical engineering to solve global energy challenges."</p>
                </div>

                <div style={{ borderLeft: '3px solid #111827', paddingLeft: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>Mission</h3>
                  <p style={{ fontStyle: 'italic', color: '#6b7280' }}>"Providing a rigorous academic environment and industry-aligned research opportunities in power systems and renewable energy."</p>
                </div>
             </div>
             <div>
                <div className="dept-info-card">
                   <div className="dept-info-card__title">Core Topics</div>
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      {dept.topics.map(t => (
                        <div key={t} style={{ padding: '8px', border: '1px solid #f3f4f6', fontSize: '12px', textAlign: 'center' }}>{t}</div>
                      ))}
                   </div>
                </div>
                <div className="dept-info-card" style={{ background: '#111827', color: '#fff', border: 'none' }}>
                   <div className="dept-info-card__title" style={{ color: 'rgba(255,255,255,0.4)', borderColor: 'rgba(255,255,255,0.1)' }}>Quick Contact</div>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ fontSize: '13px' }}><strong>HOD:</strong> {dept.head}</div>
                      <div style={{ fontSize: '13px' }}><strong>Email:</strong> {dept.email}</div>
                      <div style={{ fontSize: '13px' }}><strong>Office:</strong> {dept.location}</div>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ElectricalDepartment;
