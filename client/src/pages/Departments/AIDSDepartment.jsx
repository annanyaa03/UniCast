import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Brain, ChevronRight, Play } from 'lucide-react';
import { DEPARTMENTS } from '../../data/departments';

const AIDSDepartment = () => {
  const navigate = useNavigate();
  const dept = DEPARTMENTS.find(d => d.slug === 'aids');

  return (
    <div className="dept-page" style={{ background: '#fff', padding: '0 0 60px' }}>
      {/* TOP SECTION - MAGAZINE STYLE */}
      <div style={{ position: 'relative', padding: '60px 32px 48px', textAlign: 'center' }}>
        <div 
          style={{ position: 'absolute', top: '32px', left: '32px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', color: '#6b7280' }}
          onClick={() => navigate('/departments')}
        >
          <ArrowLeft size={16} /> Back
        </div>

        <div className="aids-hero-label">Artificial Intelligence</div>
        <h1 className="aids-hero-title">AND DATA SCIENCE</h1>
        <div className="aids-hero-rule"></div>
        <p style={{ fontSize: '16px', color: '#6b7280', maxWidth: '560px', margin: '0 auto 32px', lineHeight: 1.7 }}>
          {dept.description}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', fontSize: '14px', color: '#111827' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontWeight: 800, fontSize: '20px' }}>{dept.videos}</span>
            <span style={{ color: '#9ca3af', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>Videos</span>
          </div>
          <div style={{ width: '1px', background: '#e4e4e7' }}></div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontWeight: 800, fontSize: '20px' }}>{dept.courses}</span>
            <span style={{ color: '#9ca3af', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>Courses</span>
          </div>
          <div style={{ width: '1px', background: '#e4e4e7' }}></div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontWeight: 800, fontSize: '20px' }}>{dept.members}</span>
            <span style={{ color: '#9ca3af', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>Members</span>
          </div>
          <div style={{ width: '1px', background: '#e4e4e7' }}></div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontWeight: 800, fontSize: '20px' }}>{dept.established}</span>
            <span style={{ color: '#9ca3af', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>Est. Year</span>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #e4e4e7' }}></div>

      {/* FEATURED CONTENT ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', borderBottom: '1px solid #e4e4e7' }}>
        <div style={{ padding: '40px', borderRight: '1px solid #e4e4e7' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.1em' }}>Featured Lecture</div>
          <div className="mock-video-card" style={{ marginBottom: '24px' }}>
            <div className="mock-video-thumb" style={{ height: '360px', position: 'relative' }}>
               <div style={{ width: '64px', height: '64px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Play size={24} fill="#000" />
               </div>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#111827', margin: '16px 0 8px' }}>Deep Learning & Neural Networks: The Foundations</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
               <div className="dept-initial-circle" style={{ width: '32px', height: '32px' }}>AK</div>
               <div style={{ fontSize: '14px', color: '#4b5563' }}>Dr. Anita Kulkarni • 45:20 • 4.2k views</div>
            </div>
            <Link to="#" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#111827', fontWeight: 700, fontSize: '14px', marginTop: '20px' }}>Watch Now <ChevronRight size={16} /></Link>
          </div>
        </div>

        <div style={{ padding: '40px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '24px', letterSpacing: '0.1em' }}>Recent Uploads</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ display: 'flex', gap: '16px', borderBottom: i < 3 ? '1px solid #f3f4f6' : 'none', paddingBottom: '24px' }}>
                <div style={{ width: '120px', height: '70px', background: '#f3f4f6', flexShrink: 0 }}></div>
                <div>
                   <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px', lineHeight: 1.4 }}>Practical Data Science with Python: Part {i}</div>
                   <div style={{ fontSize: '12px', color: '#6b7280' }}>Dr. Rahul Verma • 1.2k views</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* THREE COLUMN SECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderBottom: '1px solid #e4e4e7' }}>
        <div style={{ padding: '40px', borderRight: '1px solid #e4e4e7' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '24px', letterSpacing: '0.05em' }}>Topics we cover</h2>
          {dept.topics.map(t => (
            <div key={t} className="aids-topic-row">
              {t} <ChevronRight size={14} style={{ color: '#e4e4e7' }} />
            </div>
          ))}
        </div>

        <div style={{ padding: '40px', borderRight: '1px solid #e4e4e7' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '24px', letterSpacing: '0.05em' }}>Latest Courses</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
             {dept.semesters[0].courses.map(c => (
               <div key={c.code} style={{ borderBottom: '1px solid #f3f4f6', paddingBottom: '16px' }}>
                 <div style={{ fontSize: '11px', color: '#9ca3af' }}>{c.code} • Sem 1</div>
                 <div style={{ fontSize: '15px', fontWeight: 700, marginTop: '2px' }}>{c.name}</div>
                 <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{c.videos} Videos</div>
               </div>
             ))}
          </div>
        </div>

        <div style={{ padding: '40px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '24px', letterSpacing: '0.05em' }}>Quick Stats</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
             <div>
                <div style={{ fontSize: '28px', fontWeight: 800 }}>94</div>
                <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Videos</div>
             </div>
             <div>
                <div style={{ fontSize: '28px', fontWeight: 800 }}>8</div>
                <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Courses</div>
             </div>
             <div>
                <div style={{ fontSize: '28px', fontWeight: 800 }}>210</div>
                <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Students</div>
             </div>
             <div>
                <div style={{ fontSize: '28px', fontWeight: 800 }}>2019</div>
                <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Established</div>
             </div>
          </div>
        </div>
      </div>

      {/* FACULTY SECTION */}
      <div style={{ padding: '60px 40px', borderBottom: '1px solid #e4e4e7' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '32px', letterSpacing: '0.1em' }}>Faculty Members</div>
        <div style={{ display: 'flex', gap: '32px', overflowX: 'auto', paddingBottom: '20px' }}>
          {dept.faculty.map(f => (
            <div key={f.name} style={{ minWidth: '220px', border: '1px solid #e4e4e7', padding: '24px' }}>
               <div className="dept-initial-circle" style={{ width: '40px', height: '40px', marginBottom: '16px' }}>{f.name.charAt(4)}</div>
               <div style={{ fontWeight: 800, fontSize: '15px', marginBottom: '4px' }}>{f.name}</div>
               <div style={{ fontSize: '12px', color: '#6b7280' }}>{f.specialty}</div>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '60px', padding: '60px 40px' }}>
         <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '24px' }}>About the Department</h2>
            <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: 1.8 }}>{dept.fullDescription}</p>
         </div>
         <div style={{ borderLeft: '1px solid #e4e4e7', paddingLeft: '60px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '24px' }}>Department Head</h2>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
               <div className="dept-initial-circle" style={{ width: '64px', height: '64px', fontSize: '24px' }}>AK</div>
               <div>
                  <div style={{ fontWeight: 800, fontSize: '16px' }}>{dept.head}</div>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>Head of Department</div>
                  <div style={{ fontSize: '13px', color: '#2563eb', marginTop: '4px' }}>{dept.email}</div>
               </div>
            </div>
            <div style={{ marginTop: '40px' }}>
               <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px' }}>LOCATION</div>
               <div style={{ fontSize: '14px', fontWeight: 600 }}>{dept.location}</div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AIDSDepartment;
