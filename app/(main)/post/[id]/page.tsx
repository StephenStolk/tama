"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ArrowBigUp, ArrowBigDown, Share, Eye } from "lucide-react"
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

export default function PostPage() {
  const { id } = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const [postResponse, commentsResponse] = await Promise.all([
          fetch(`https://dummyjson.com/posts/${id}`),
          fetch(`https://dummyjson.com/posts/${id}/comments`),
        ])
        const postData = await postResponse.json()
        const commentsData = await commentsResponse.json()
        setPost(postData)
        setComments(commentsData.comments)
      } catch (error) {
        console.error("Error fetching post and comments:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPostAndComments()
  }, [id])

  if (loading) {
    return (
      <div className="mt-20 flex justify-center items-center h-full">
        <div className="spinner-border animate-spin w-12 h-12 border-t-4 border-black border-solid rounded-full"></div>
      </div>
    )
  }

  if (!post) {
    return <div>Post not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full mb-8">
        <CardHeader className="flex flex-row items-center space-x-4">
          <Avatar>
            <AvatarImage src={`/placeholder-user-${post.userId}.jpg`} alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium sm:text-base">u/username{post.userId}</p>
            <p className="text-xs text-muted-foreground">Posted 2 hours ago</p>
          </div>
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-semibold mb-4">{post.title}</h2>
          <p className="text-base mb-4">{post.body}</p>
          <div className="flex flex-wrap mb-4">
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
          <Button variant="ghost" className="flex items-center space-x-2">
            <Share className="h-5 w-5" />
            <span className="text-sm">Share</span>
          </Button>
        </CardFooter>
      </Card>

      <h3 className="text-xl font-semibold mb-4">Comments</h3>
      {comments.map((comment) => (
        <Card key={comment.id} className="w-full mb-4">
          <CardHeader className="flex flex-row items-center space-x-4">
            <Avatar>
              <AvatarImage src={`/placeholder-user-${comment.user.id}.jpg`} alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{comment.user.username}</p>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{comment.body}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

