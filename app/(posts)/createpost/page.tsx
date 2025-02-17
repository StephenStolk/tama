"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
//import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
//import { Link, ImageIcon, ListOrdered, List, ChevronDown } from "lucide-react"
import NotePicker from "@/components/NotePicker"
import ImageUpload from "@/components/ImageUpload"
import VideoUpload from "@/components/VideoUpload"
import LinkUpload from "@/components/LinkUpload"
import PollUpload from "@/components/PollUpload"

export default function CreatePost() {
  const [title, setTitle] = useState("")
  const [pollOptions, setPollOptions] = useState(["", ""])
  const [selectedTab, setSelectedTab] = useState("post")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [linkUrl, setLinkUrl] = useState("")
  const [votingLength, setVotingLength] = useState("3")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const filesArray = Array.from(e.target.files)
      setMediaFiles(filesArray);
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    const formData = new FormData()
    formData.append("title", title)
    formData.append("type", selectedTab)

    if (selectedTab === "images" && mediaFiles) {
      mediaFiles.forEach((file) => {
        console.log(file);
        formData.append("image", file);
      });
      console.log(formData);
    } else if (selectedTab === "videos" && mediaFiles) {
      mediaFiles.forEach((file) => {
        console.log(file);
        formData.append("video", file);
      });
      console.log(formData);

    } else if (selectedTab === "link") {
      formData.append("link", linkUrl)
    } else if (selectedTab === "poll") {

      const formattedPollOptions = pollOptions.map(option => ({
        option,
        votes: 0,
      }))
      formData.append("pollOptions", JSON.stringify(formattedPollOptions))
      formData.append("votingLength", votingLength)
    }

    //to check or debug
    console.log(formData);

    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      
      const response = await fetch("/api/posts/create", {
        method: "POST",
        body: formData,
      })

      console.log(response);

      if (!response.ok) {
        throw new Error("Failed to create post")
      }
      alert("Post created successfully!")
      setTitle("")
      setPollOptions(["", ""])
      setMediaFiles([])
      setLinkUrl("")
    } catch (error) {
      console.error(error);
      alert("Error creating post")
    } finally {
      setIsSubmitting(false)
    }
  }

  

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Create a post</h1>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 mt-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <span className="text-sm">u/Username</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="post" onValueChange={setSelectedTab} className="w-full">
        <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b">
          <TabsTrigger value="post">Post</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="link">Link</TabsTrigger>
          <TabsTrigger value="poll">Poll</TabsTrigger>
        </TabsList>

        <div className="bg-white p-4 rounded-b-lg border border-t-0">
          <Input placeholder="Title" className="mb-4" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={300} />
          <div className="text-xs text-right text-gray-500 -mt-3 mb-2">{title.length}/300</div>

          <TabsContent value="post">
            <NotePicker />
          </TabsContent>

          <TabsContent value="images">
            <ImageUpload title={title} count={title.length} />
          </TabsContent>

          <TabsContent value="videos">
            <VideoUpload title={title} count={title.length}/>
          </TabsContent>

          <TabsContent value="link">
            <LinkUpload />
          </TabsContent>

          <TabsContent value="poll">
           <PollUpload title={title} count={title.length}/>
          </TabsContent>

          
        </div>
      </Tabs>
    </div>
  )
}

// I have updated the ui part for the create post. I need your help to add functionalities for bold, italics, list etc (others mentioned)
