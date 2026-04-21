import React from 'react';

const PageLoader = () => (
  <div className="page-loader">
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ width: 28, height: 28, background: 'var(--gray-900)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#fff', fontSize: 11, fontWeight: 800 }}>UC</span>
        </div>
        <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-0.03em' }}>UniCast</span>
      </div>
      <div className="spinner" style={{ margin: '0 auto' }} />
    </div>
  </div>
);

export default PageLoader;
