"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ArrowBigUp, ArrowBigDown, MessageSquare, Share } from 'lucide-react'
import { Button } from "@/components/ui/button"

export const PostCard:React.FC = () => {
    return(
        <>
        <div className="md:col-span-2 space-y-6">
    {[1, 2, 3,4,5].map((post) => (
      <Card key={post} className="w-full">
        <CardHeader className="flex flex-row items-center space-x-4">
          <Avatar>
            <AvatarImage src={`/placeholder-user-${post}.jpg`} alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium sm:text-base">u/username{post}</p>
            <p className="text-xs text-muted-foreground">Posted 2 hours ago</p>
          </div>
        </CardHeader>
        <CardContent>
          <h2 className="text-lg font-semibold mb-2 sm:text-xl">Post Title {post}</h2>
          <p className="text-sm sm:text-base">
            This is the content of post {post}. It can be quite long and detailed.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <ArrowBigUp className="h-5 w-5" />
            </Button>
            <span className="text-sm">42</span>
            <Button variant="ghost" size="icon">
              <ArrowBigDown className="h-5 w-5" />
            </Button>
          </div>
          <Button variant="ghost" className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span className="text-sm">23 Comments</span>
          </Button>
          <Button variant="ghost" className="flex items-center space-x-2">
            <Share className="h-5 w-5" />
            {/* <span className="text-sm">Share</span> */}
          </Button>
        </CardFooter>
      </Card>
    ))}
  </div>
        </>
    )
}