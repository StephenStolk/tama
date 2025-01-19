'use client';

import Link from 'next/link';
import { X as CloseIcon } from 'lucide-react';

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const tablinks = [
    { name: 'Home', to: '/' },
    { name: 'My Posts', to: '/myposts' },
    { name: 'Feed', to: '/' },
    { name: 'Clubs', to: '/' },
  ];

  return (
    <>
      {/* Sidebar for large screens */}
      <div className="hidden md:block fixed top-20 left-4 w-1/5 h-[calc(100vh-8rem)] rounded-xl p-4 z-30 border border-gray">
        <nav>
          <ul className="space-y-4">
            {tablinks.map((tab, index) => (
              <li key={index}>
                <Link
                  href={tab.to}
                  className="block px-4 py-2 rounded hover:bg-gray-700"
                >
                  {tab.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Sidebar for mobile screens */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-opacity-50" onClick={toggleSidebar}>
          <div className="fixed top-0 left-0 w-3/4 h-full bg-gray-200 p-4 z-50">
            <button
              onClick={toggleSidebar}
              className="absolute top-4 right-4"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
            <nav>
              <ul className="space-y-4">
                {tablinks.map((tab, index) => (
                  <li key={index}>
                    <Link
                      href={tab.to}
                      onClick={toggleSidebar}
                      className="block px-4 py-2 rounded hover:bg-gray-700"
                    >
                      {tab.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
