import React, { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import BottomNav from './BottomNav.jsx';

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const handleToggle = useCallback(() => setCollapsed(c => !c), []);

  return (
    <div className={`app-shell ${collapsed ? 'sidebar-is-collapsed' : ''}`}>
      <Sidebar collapsed={collapsed} onToggle={handleToggle} />
      <main className="app-main">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}