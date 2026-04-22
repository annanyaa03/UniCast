import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ArrowRight, Brain, Cpu, Database, Zap, Settings as SettingsIcon, Radio } from 'lucide-react';

const DEPARTMENTS = [
  {
    name: 'COMPUTER',
    icon: <Cpu size={24} />,
    desc: 'Department of Computer Engineering and Information Technology. Focus on software, AI, and systems.',
    courses: '12 Courses',
    color: 'var(--blue)'
  },
  {
    name: 'IT',
    icon: <Database size={24} />,
    desc: 'Department of Information Technology. Specializing in data management, networking, and security.',
    courses: '10 Courses',
    color: 'var(--green)'
  },
  {
    name: 'AIDS',
    icon: <Brain size={24} />,
    desc: 'Artificial Intelligence and Data Science. The future of intelligent machines and big data analytics.',
    courses: '8 Courses',
    color: 'var(--red)'
  },
  {
    name: 'ENTC',
    icon: <Radio size={24} />,
    desc: 'Electronics and Telecommunication. Exploring communication systems, VLSI, and signal processing.',
    courses: '14 Courses',
    color: 'var(--yellow)'
  },
  {
    name: 'ELECTRICAL',
    icon: <Zap size={24} />,
    desc: 'Electrical Engineering. Power systems, renewable energy, and control mechanisms.',
    courses: '11 Courses',
    color: '#ed8936'
  },
  {
    name: 'INSTRUMENTATION',
    icon: <SettingsIcon size={24} />,
    desc: 'Instrumentation and Control. Precision measurements and industrial automation logic.',
    courses: '9 Courses',
    color: '#805ad5'
  }
];

const Departments = () => {
  return (
    <div className="page-pad">
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div className="navbar__logo-mark" style={{ width: '40px', height: '40px' }}>
            <Building2 size={20} color="white" />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.03em' }}>Departments</h1>
        </div>
        <p className="auth-subtitle" style={{ maxWidth: '600px', fontSize: '15px' }}>
          Explore the various academic departments of UniCast. Each department is a hub of innovation, 
          dedicated research, and specialized knowledge sharing.
        </p>
      </div>

      <div className="video-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
        {DEPARTMENTS.map((dept) => (
          <Link key={dept.name} to={`/departments/${dept.name.toLowerCase()}`} className="club-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '24px', flex: 1 }}>
              <div 
                style={{ 
                  width: '48px', 
                  height: '48px', 
                  background: 'var(--gray-100)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: '20px',
                  color: 'var(--gray-900)'
                }}
              >
                {dept.icon}
              </div>
              
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>{dept.name}</h2>
              <p className="club-card__desc" style={{ fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
                {dept.desc}
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: 'auto' }}>
                <span className="badge badge--gray" style={{ borderRadius: '0px' }}>{dept.courses}</span>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600, color: 'var(--gray-900)' }}>
                  View Channel <ArrowRight size={14} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="divider" style={{ margin: '60px 0' }}></div>

      <div style={{ 
        background: 'var(--gray-900)', 
        padding: '32px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        color: 'white'
      }}>
        <div>
          <h3 style={{ color: 'white', fontSize: '20px', marginBottom: '8px' }}>Join a department community</h3>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>Stay updated with the latest events and lectures from your department.</p>
        </div>
        <button className="btn btn--outline" style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
          Explore Now
        </button>
      </div>
    </div>
  );
};

export default Departments;
