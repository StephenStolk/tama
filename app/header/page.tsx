'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, MessageSquare, Plus, Search, Menu as MenuIcon, X as CloseIcon } from 'lucide-react';

export const Header: React.FC = () => { // Fixed arrow function syntax
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isLoggedIn = false; // Replace this with your actual authentication logic
  const username = 'John Doe';

  const toggleMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-red-500">Tamas</Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input type="text" placeholder="Search Reddit" className="w-full pl-10" />
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Plus className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MessageSquare className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          {isLoggedIn ? (
            <Link href="/profile">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback>{username.charAt(0)}</AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <Link href="/signup">
              <Button variant="ghost">Sign Up</Button>
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleMenu}
        >
          {isMobileMenuOpen ? (
            <CloseIcon className="h-6 w-6 text-gray-700" />
          ) : (
            <MenuIcon className="h-6 w-6 text-gray-700" />
          )}
        </Button>
      </div>

      {/* Mobile Nav Drawer */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={toggleMenu}
          ></div>

          {/* Mobile Nav Drawer */}
          <div className="fixed top-0 left-0 w-full bg-white shadow-md z-30 md:hidden">
            <div className="p-4">
              <nav className="space-y-2">
                <Link href="/feed" className="block text-gray-700">
                  Feed
                </Link>
                <Link href="/clubs" className="block text-gray-700">
                  Clubs
                </Link>
                <Link href="/trends" className="block text-gray-700">
                  Trends
                </Link>
                <Link href="/notifications" className="block text-gray-700">
                  Notifications
                </Link>
                <div className="mt-4">
                  {isLoggedIn ? (
                    <Link href="/profile">
                      <Avatar>
                        <AvatarImage src="/placeholder-user.jpg" alt="User" />
                        <AvatarFallback>{username.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Link>
                  ) : (
                    <Link href="/signup">
                      <Button className="w-full">Sign Up</Button>
                    </Link>
                  )}
                </div>
              </nav>
            </div>
          </div>
        </>
      )}
    </header>
  );
};
