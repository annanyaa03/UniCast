import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { DEPARTMENTS } from '../data/departments';

const DepartmentCard = ({ dept }) => {
  const navigate = useNavigate();

  return (
    <div
      className="dept-card"
      onClick={() => navigate(`/departments/${dept.slug}`)}
      style={{ cursor: 'pointer' }}
    >
      <div className="dept-card__icon-box">
        <dept.icon size={28} />
      </div>
      <h3 className="dept-card__name">{dept.shortName}</h3>
      <p className="dept-card__desc">{dept.description}</p>
      <div className="dept-card__footer">
        <span className="dept-card__courses">{dept.courses} Courses</span>
        <span
          className="dept-card__link"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/departments/${dept.slug}`);
          }}
        >
          View Channel →
        </span>
      </div>
    </div>
  );
};

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

      <div className="video-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {DEPARTMENTS.map((dept) => (
          <DepartmentCard key={dept.slug} dept={dept} />
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
