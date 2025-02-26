"use client"

import { useEffect, useState } from "react"
import { use } from "react" // Import React.use
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowBigUp, ArrowBigDown, Share, Copy, Link as LinkIcon } from "lucide-react"
import Image from "next/image"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu" // Assuming you have a dropdown menu component

interface Post {
  _id: string
  title: string
  content?: string
  imageUrl?: string
  videoUrl?: string
  pollOptions?: Array<{ option: string; votes: number }>
  author: string
  type: "image" | "video" | "post" | "poll"
  tags: string[]
  createdAt: string
}

interface Comment {
  _id: string
  author: { username: string }
  content: string
  createdAt: string
}

export default function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [voteType, setVoteType] = useState<"upvote" | "downvote" | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const defaultAvatar = "https://api.dicebear.com/7.x/avatars/svg"

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return

      try {
        const res = await fetch(`/api/posts/${id}`)
        if (!res.ok) throw new Error("Failed to fetch post")
        const data = await res.json()
        setPost(data)

        const commentsRes = await fetch(`/api/posts/comments?postId=${id}`)
        if (commentsRes.ok) {
          const commentsData = await commentsRes.json()
          setComments(commentsData.comments || [])
        }
      } catch (error) {
        console.error("Error:", error)
        setError("Failed to load post")
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id])

  const handleVote = async (newVoteType: "upvote" | "downvote") => {
    if (!post) return

    try {
      if (voteType === newVoteType) {
        await fetch(`/api/posts/votes?postId=${post._id}`, {
          method: "DELETE",
          credentials: "include",
        })
        setVoteType(null)
      } else {
        const res = await fetch("/api/posts/votes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            postId: post._id,
            voteType: newVoteType,
            type: post.type,
          }),
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.message || "Failed to vote")
        }

        setVoteType(newVoteType)
      }
    } catch (error) {
      console.error("Error handling vote:", error)
      alert("Failed to vote. Please try again.")
    }
  }

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !post) return

    try {
      const res = await fetch("/api/posts/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          postId: post._id,
          content: newComment,
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to post comment")
      }

      const data = await res.json()
      setComments((prev) => [...prev, data.comment])
      setNewComment("")
    } catch (error) {
      console.error("Error submitting comment:", error)
      alert("Failed to post comment. Please try again.")
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title || "Check this out",
        url: window.location.href,
      }).catch((error) => console.error("Error sharing:", error))
    } else {
      alert("Sharing not supported in this browser.");
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000) // Reset the copied state after 2 seconds
    })
  }

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>
  if (!post) return <div className="flex justify-center items-center min-h-screen">Post not found</div>

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Card className="w-full border border-gray-200 shadow-sm">
        <CardHeader className="flex flex-row items-center gap-3 p-4 border-b border-gray-100">
          <Avatar className="h-10 w-10">
            <AvatarImage src={defaultAvatar} alt={post?.author || "User"} />
            <AvatarFallback>{post?.author?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-900">{post.author}</p>
            <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>

          {post.type === "post" && post.content && <p className="text-gray-700 mb-4">{post.content}</p>}

          {post.type === "image" && post.imageUrl && (
            <div className="mb-4">
              <Image
                src={post.imageUrl || "/placeholder.svg"}
                alt={post.title}
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}

          {post.type === "video" && post.videoUrl && (
            <div className="mb-4">
              <video controls className="w-full rounded-lg">
                <source src={post.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {post.type === "poll" && post.pollOptions && (
            <div className="space-y-2 mb-4">
              {post.pollOptions.map((option, index) => (
                <div key={index} className="flex justify-between items-center border p-2 rounded-md">
                  <span>{option.option}</span>
                  <span>{option.votes} votes</span>
                </div>
              ))}
            </div>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-full border border-gray-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-wrap justify-between items-center p-4 border-t border-gray-100">
          <div className="flex gap-2">
            <Button
              variant={voteType === "upvote" ? "default" : "ghost"}
              size="icon"
              onClick={() => handleVote("upvote")}
            >
              <ArrowBigUp className="h-5 w-5" />
            </Button>
            <Button
              variant={voteType === "downvote" ? "default" : "ghost"}
              size="icon"
              onClick={() => handleVote("downvote")}
            >
              <ArrowBigDown className="h-5 w-5" />
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <Share className="h-5 w-5" />
                <span className="text-sm">Share</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={handleShare}>
                <LinkIcon className="h-4 w-4 mr-2" />
                Share via Apps
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {copied && (
            <span className="text-xs text-green-500">Link copied!</span>
          )}
        </CardFooter>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Comments</h2>
          <div className="flex gap-2 mb-6">
            <Input
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit()}
              className="flex-1"
            />
            <Button onClick={handleCommentSubmit} disabled={!newComment.trim()}>
              Post
            </Button>
          </div>

          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment._id} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={defaultAvatar} alt={comment.author.username} />
                      <AvatarFallback>{comment.author.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-semibold">{comment.author.username}</p>
                    <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
