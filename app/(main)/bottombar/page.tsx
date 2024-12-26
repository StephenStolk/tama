'use client';

import { FiHome, FiBell, FiTrendingUp, FiUsers } from 'react-icons/fi';
import { useState } from 'react';

export default function Navigation() {
  const [activeTab, setActiveTab] = useState('Feed'); // Default active tab

  const tabs = [
    { name: 'Feed', icon: FiHome },
    { name: 'Clubs', icon: FiUsers },
    { name: 'Trends', icon: FiTrendingUp },
    { name: 'Notify', icon: FiBell },
  ];

  return (
    <>
      {/* Sidebar for Desktop */}
      {/* <nav className="hidden md:flex fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200">
        <ul className="space-y-6 py-6 px-4">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.name;

            return (
              <li
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center space-x-3 cursor-pointer p-2 rounded-md ${
                  isActive ? 'text-red-500 bg-red-100' : 'text-gray-600'
                }`}
              >
                <tab.icon className="text-xl" />
                <span>{tab.name}</span>
              </li>
            );
          })}
        </ul>
      </nav> */}

      {/* Bottom Bar for Mobile */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 md:hidden">
        <ul className="flex justify-around py-3 text-sm text-gray-600">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.name;

            return (
              <li
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex flex-col items-center cursor-pointer ${
                  isActive ? 'text-red-500 bg-red-100 rounded-lg px-3 py-1' : ''
                }`}
              >
                <tab.icon className="text-xl" />
                <span>{tab.name}</span>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
