import { useEffect, useState } from 'react';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';

function Layout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('sidebar-collapsed') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sidebar-collapsed', String(sidebarCollapsed));
    } catch {
      // localStorage может быть недоступен
    }
  }, [sidebarCollapsed]);

  return (
    <div className={`app${sidebarCollapsed ? ' app--sidebar-collapsed' : ''}`}>
      <Sidebar />
      <div className="main">
        <Header
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed((collapsed) => !collapsed)}
        />
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;