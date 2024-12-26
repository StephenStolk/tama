'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, MessageSquare, Plus, Search, Menu as MenuIcon } from 'lucide-react';
import Sidebar from '../sidebar/page';
export const Header: React.FC = () => { 
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const isLoggedIn = false; // Replace this with your actual authentication logic
  const username = 'John Doe';

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow fixed top-0 left-0 w-full z-50">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          {/* Hamburger Icon for Mobile */}
          <button
            className="md:hidden p-2 rounded z-50"
            onClick={toggleSidebar}
          >
            <MenuIcon className="h-6 w-6" />
          </button>

          {/* Logo */}
          <Link href="/" className="text-xl md:text-2xl font-bold text-red-500">
            Tamas
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input type="text" placeholder="Search Reddit" className="w-full pl-10" />
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="flex items-center space-x-3 md:space-x-4">
            <Button variant="ghost" size="icon" className="p-1 md:p-2">
              <Plus className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="p-1 md:p-2">
              <MessageSquare className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="p-1 md:p-2">
              <Bell className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
            {isLoggedIn ? (
              <Link href="/profile">
                <Avatar className="h-8 w-8 md:h-10 md:w-10">
                  <AvatarImage src="/placeholder-user.jpg" alt="User" />
                  <AvatarFallback>{username.charAt(0)}</AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <Link href="/signup">
                <Button variant="ghost" className="text-sm md:text-base">Sign Up</Button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Sidebar (conditionally rendered) */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
};
