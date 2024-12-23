import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, MessageSquare, Plus, Search } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-red-500">Tamas</Link>
        <div className="flex-1 max-w-xl mx-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input type="text" placeholder="Search Reddit" className="w-full pl-10" />
          </div>
        </div>
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
          <Link href="/profile">
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </Link>
        </nav>
        <Button className="md:hidden">Menu</Button>
      </div>
    </header>
  )
}

