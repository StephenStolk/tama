// 'use client';

// import Link from 'next/link';
// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Bell, MessageSquare, Plus, Search, Menu as MenuIcon } from 'lucide-react';
// import Sidebar from '../sidebar/page';
// export const Header: React.FC = () => { 
//   const [isSidebarOpen, setSidebarOpen] = useState(false);

//   const toggleSidebar = () => {
//     setSidebarOpen(!isSidebarOpen);
//   };

//   const isLoggedIn = false; // Replace this with your actual authentication logic
//   const username = 'John Doe';

//   return (
//     <>
//       {/* Header */}
//       <header className="bg-white shadow fixed top-0 left-0 w-full z-50">
//         <div className="container mx-auto px-4 py-2 flex items-center justify-between">
//           {/* Hamburger Icon for Mobile */}
//           <button
//             className="md:hidden p-2 rounded z-50"
//             onClick={toggleSidebar}
//           >
//             <MenuIcon className="h-6 w-6" />
//           </button>

//           {/* Logo */}
//           <Link href="/" className="text-xl md:text-2xl font-bold text-red-500">
//             Tamas
//           </Link>

//           {/* Search Bar */}
//           <div className="flex-1 max-w-xl mx-4 hidden md:block">
//             <div className="relative">
//               <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <Input type="text" placeholder="Search Reddit" className="w-full pl-10" />
//             </div>
//           </div>

//           {/* Desktop Nav */}
//           <nav className="flex items-center space-x-3 md:space-x-4">
//             <Button variant="ghost" size="icon" className="p-1 md:p-2">
//               <Plus className="h-4 w-4 md:h-5 md:w-5" />
//             </Button>
//             <Button variant="ghost" size="icon" className="p-1 md:p-2">
//               <MessageSquare className="h-4 w-4 md:h-5 md:w-5" />
//             </Button>
//             <Button variant="ghost" size="icon" className="p-1 md:p-2">
//               <Bell className="h-4 w-4 md:h-5 md:w-5" />
//             </Button>
//             {isLoggedIn ? (
//               <Link href="/profile">
//                 <Avatar className="h-8 w-8 md:h-10 md:w-10">
//                   <AvatarImage src="/placeholder-user.jpg" alt="User" />
//                   <AvatarFallback>{username.charAt(0)}</AvatarFallback>
//                 </Avatar>
//               </Link>
//             ) : (
//               <Link href="/signup">
//                 <Button variant="ghost" className="text-sm md:text-base">Sign Up</Button>
//               </Link>
//             )}
//           </nav>
//         </div>
//       </header>

//       {/* Sidebar (conditionally rendered) */}
//       <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
//     </>
//   );
// };

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, MessageSquare, Plus, Search, Menu as MenuIcon } from 'lucide-react';
import Sidebar from '../sidebar/page';

export const Header: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false); // New state to track hover

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Check login status and username on component mount
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUsername(null);
    window.location.reload();
  };

  return (
    <>
      <header className="bg-white shadow fixed top-0 left-0 w-full z-50">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <button
            className="md:hidden p-2 rounded z-50"
            onClick={toggleSidebar}
          >
            <MenuIcon className="h-6 w-6" />
          </button>

          <Link href="/" className="text-xl md:text-2xl font-bold text-red-500">
            Tamas
          </Link>

          <div className="flex-1 max-w-xl mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input type="text" placeholder="Search Reddit" className="w-full pl-10" />
            </div>
          </div>

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
              <div
                className="relative"
                onMouseEnter={() => setIsHovered(true)} // Show logout on hover
                onMouseLeave={() => setIsHovered(false)} // Hide logout when hover ends
              >
                <Link href="/profile">
                  <Avatar className="h-8 w-8 md:h-10 md:w-10">
                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                    <AvatarFallback>{username?.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Link>
                {isHovered && (
                  <Button
                    onClick={handleLogout}
                    className="absolute top-0 right-0 mt-8 mr-2 p-1 text-sm text-white"
                  >
                    Logout
                  </Button>
                )}
              </div>
            ) : (
              <Link href="/signup">
                <Button variant="ghost" className="text-sm md:text-base">Sign Up</Button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
};
