'use client';

import { useState } from 'react';
import Sidebar from './page';

export const SidebarWrapper: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
  );
};
