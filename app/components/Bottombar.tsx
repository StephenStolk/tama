"use client"

import { FiHome, FiBell, FiTrendingUp, FiUsers } from 'react-icons/fi'

export default function BottomBar() {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 md:hidden">
      <ul className="flex justify-around py-3 text-sm text-gray-600">
        <li className="flex flex-col items-center">
          <FiHome className="text-xl" />
          <span>Feed</span>
        </li>
        <li className="flex flex-col items-center">
          <FiUsers className="text-xl" />
          <span>Clubs</span>
        </li>
        <li className="flex flex-col items-center">
          <FiTrendingUp className="text-xl" />
          <span>Trends</span>
        </li>
        <li className="flex flex-col items-center">
          <FiBell className="text-xl" />
          <span>Notifications</span>
        </li>
      </ul>
    </nav>
  )
}
