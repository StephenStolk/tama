import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowBigUp, ArrowBigDown, MessageSquare, Share, Bookmark } from 'lucide-react'

interface PostPreviewProps {
  title: string
  content: string
  username: string
}

export function PostPreview({ title, content, username }: PostPreviewProps) {
  return (
    <div className="bg-white rounded-md border border-gray-300 p-4">
      <div className="flex items-center gap-2 mb-2">
        <Avatar className="h-6 w-6">
          {/* <AvatarImage src="/placeholder.svg" /> */}
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium">Posted by u/{username}</span>
        <span className="text-xs text-gray-500">just now</span>
      </div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <div 
        className="prose prose-sm max-w-none mb-4"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <div className="flex items-center gap-4 text-gray-500">
        <button className="flex items-center gap-1 hover:bg-gray-100 rounded-md px-2 py-1">
          <ArrowBigUp className="h-5 w-5" />
          <span className="sr-only">Upvote</span>
        </button>
        <span className="font-medium">0</span>
        <button className="flex items-center gap-1 hover:bg-gray-100 rounded-md px-2 py-1">
          <ArrowBigDown className="h-5 w-5" />
          <span className="sr-only">Downvote</span>
        </button>
        <button className="flex items-center gap-1 hover:bg-gray-100 rounded-md px-2 py-1">
          <MessageSquare className="h-5 w-5" />
          <span className="text-sm">0 Comments</span>
        </button>
        <button className="flex items-center gap-1 hover:bg-gray-100 rounded-md px-2 py-1">
          <Share className="h-5 w-5" />
          <span className="text-sm">Share</span>
        </button>
        <button className="flex items-center gap-1 hover:bg-gray-100 rounded-md px-2 py-1">
          <Bookmark className="h-5 w-5" />
          <span className="text-sm">Save</span>
        </button>
      </div>
    </div>
  )
}