"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RichTextEditor from "@/components/RichTextEditor"
import { PostPreview } from "../post-preview/page"

export default function CreatePost() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [showPreview, setShowPreview] = useState(false)

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Create a post</h1>
      </div>

      <Tabs defaultValue="post">
        <TabsList className="w-full flex border-b">
          <TabsTrigger value="post">Post</TabsTrigger>
          <TabsTrigger value="preview" onClick={() => setShowPreview((prev) => !prev)}>
            {showPreview ? "Edit" : "Preview"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="post">
          <Input
            placeholder="Title"
            className="mb-4"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={300}
          />
          <div className="text-xs text-right text-gray-500 -mt-3 mb-2">{title.length}/300</div>

          <RichTextEditor onChange={setContent} initialContent={content} />
        </TabsContent>

        <TabsContent value="preview">
          <PostPreview title={title} content={content} username={""} />
        </TabsContent>
      </Tabs>

      <Button className="mt-4 w-full" onClick={() => console.log({ title, content })}>
        Post
      </Button>
    </div>
  )
}
