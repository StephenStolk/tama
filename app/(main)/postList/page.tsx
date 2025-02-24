"use client"
import { useEffect, useState } from "react"
import UnifiedPostCard from "@/components/unified-post-card"

interface Post {
  slug: string
  tags: string[]
  _id: string
  title: string
  type: "image" | "video" | "post" | "poll"
  createdAt: string
  imageUrl?: string
  videoUrl?: string
  content?: string
  pollOptions?: { option: string; votes: number }[]
  author: string
}

const PostList = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const [textRes, imageRes, videoRes, pollRes] = await Promise.all([
          fetch("/api/posts/post"),
          fetch("/api/posts/images"),
          fetch("/api/posts/videos"),
          fetch("/api/posts/polls"),
        ])

        // Check the status of each response and log it
        if (!textRes.ok) {
          console.error("Failed to fetch text posts:", textRes.status, textRes.statusText)
        }
        if (!imageRes.ok) {
          console.error("Failed to fetch image posts:", imageRes.status, imageRes.statusText)
        }
        if (!videoRes.ok) {
          console.error("Failed to fetch video posts:", videoRes.status, videoRes.statusText)
        }
        if (!pollRes.ok) {
          console.error("Failed to fetch poll posts:", pollRes.status, pollRes.statusText)
        }

        // Only parse JSON if the response was successful
        const textData = textRes.ok ? await textRes.json() : []
        const imageData = imageRes.ok ? await imageRes.json() : []
        const videoData = videoRes.ok ? await videoRes.json() : []
        const pollData = pollRes.ok ? await pollRes.json() : []

        const allPosts = [...textData, ...imageData, ...videoData, ...pollData]
        allPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        setPosts(allPosts)
      } catch (error) {
        console.error("Error fetching posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) return <p>Loading posts...</p>

  return (
    <div className="py-20 space-y-6">
      {posts.map((post) => (
        <UnifiedPostCard key={post._id} post={post} />
      ))}
    </div>
  )
}

export default PostList

