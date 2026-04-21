import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSidebarOpen } from '../../store/slices/uiSlice';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const NO_SIDEBAR = ['/watch', '/login', '/register', '/shorts'];

const Layout = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { sidebarOpen, sidebarCollapsed } = useSelector((s) => s.ui);

  const isNoSidebar = NO_SIDEBAR.some((r) => location.pathname.startsWith(r));

  useEffect(() => {
    if (window.innerWidth < 768) dispatch(setSidebarOpen(false));
  }, [location.pathname, dispatch]);

  const contentClass = [
    'main-content',
    isNoSidebar || !sidebarOpen ? 'no-sidebar' : '',
    sidebarOpen && sidebarCollapsed && !isNoSidebar ? 'collapsed' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="app-wrapper">
      <Navbar />
      <div className="main-layout">
        {!isNoSidebar && <Sidebar />}
        <main className={contentClass}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
