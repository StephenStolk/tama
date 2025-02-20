"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"  // Import useRouter hook
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ArrowBigUp, ArrowBigDown, Share, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Post {
  id: number
  title: string
  body: string
  userId: number
  tags: string[]
  reactions: {
    likes: number
    dislikes: number
  }
  views: number
}

interface Comment {
  id: number
  body: string
  postId: number
  user: {
    id: number
    username: string
  }
}

interface ApiResponse {
  posts: Post[]
  total: number
  skip: number
  limit: number
}

export const PostCard: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [visibleComments, setVisibleComments] = useState<{ [key: number]: boolean }>({})
  const [comments, setComments] = useState<{ [key: number]: Comment[] }>({})
  const router = useRouter()  // useRouter hook to handle navigation

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("https://dummyjson.com/posts")
        const data: ApiResponse = await response.json()
        setPosts(data.posts)
      } catch (error) {
        console.error("Error fetching posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const toggleComments = async (postId: number) => {
    if (visibleComments[postId]) {
      setVisibleComments({ ...visibleComments, [postId]: false })
    } else {
      try {
        const response = await fetch(`https://dummyjson.com/posts/${postId}/comments`)
        const data = await response.json()
        setComments({ ...comments, [postId]: data.comments })
        setVisibleComments({ ...visibleComments, [postId]: true })
      } catch (error) {
        console.error("Error fetching comments:", error)
      }
    }
  }

  // Handle click to redirect to post page
  const handleRedirect = (postId: number) => {
    router.push(`/post/${postId}`)
  }

  if (loading) {
    return (
      <div className="mt-20 flex justify-center items-center h-full">
        <div className="spinner-border animate-spin w-12 h-12 border-t-4 border-black border-solid rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="md:col-span-2 space-y-6 py-14">
      {posts.map((post) => (
        <Card key={post.id} className="w-full">
          <CardHeader className="flex flex-row items-center space-x-4">
            <Avatar>
              <AvatarImage src={`/placeholder-user-${post.userId}.jpg`} alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium sm:text-base hover:underline cursor-pointer">u/username{post.userId}</p>
              <p className="text-xs text-muted-foreground">Posted 2 hours ago</p>
            </div>
          </CardHeader>
          <CardContent>
            <div
              className="cursor-pointer hover:underline text-lg font-semibold mb-2 sm:text-xl"
              onClick={() => handleRedirect(post.id)}  // Make the title clickable
            >
              {post.title}
            </div>
            <div
              className="cursor-pointer text-sm sm:text-base"
              onClick={() => handleRedirect(post.id)}  // Make the body clickable
            >
              {post.body}
            </div>
            <div className="mt-2 flex flex-wrap">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <ArrowBigUp className="h-5 w-5" />
              </Button>
              <span className="text-sm">{post.reactions.likes}</span>
              <Button variant="ghost" size="icon">
                <ArrowBigDown className="h-5 w-5" />
              </Button>
              <span className="text-sm">{post.reactions.dislikes}</span>
            </div>
            <Button
              variant="ghost"
              className="flex items-center space-x-2"
              onClick={() => toggleComments(post.id)}
            >
              <MessageSquare className="h-5 w-5" />
              <span className="text-sm">{visibleComments[post.id] ? 'Comments' : 'Comments'}</span>
            </Button>
            <Button variant="ghost" className="flex items-center space-x-2">
              <Share className="h-5 w-5" />
              <span className="text-sm">Share</span>
            </Button>
          </CardFooter>

          {/* Comments section */}
          {visibleComments[post.id] && (
            <CardContent className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Comments</h3>
              {comments[post.id] && comments[post.id].length > 0 ? (
                comments[post.id].map((comment) => (
                  <div key={comment.id} className="flex flex-col mb-4">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage
                          src={`/placeholder-user-${comment.user.id}.jpg`}
                          alt="User"
                        />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{comment.user.username}</p>
                      </div>
                    </div>
                    <CardContent>
                      <p className="text-sm">{comment.body}</p>
                    </CardContent>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No comments yet</p>
              )}
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}
