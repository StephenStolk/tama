// /createpost/page.tsx
"use client";

import { useState } from "react";
// import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, ImageIcon, ListOrdered, List, ChevronDown } from "lucide-react";
import NotePicker from "@/components/NotePicker";
// import Cookies from "js-cookie";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  // const router = useRouter();

  // useEffect(() => {
  //   const token = Cookies.get("token");
  //   console.log(token);
  //   if (!token) {
  //     router.push("/login");
  //   }
  // }, [router]);

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
          <div className="flex items-center gap-2">
            <span className="text-sm text-blue-500">DRAFTS</span>
            <span className="bg-gray-200 px-2 rounded-sm">0</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="post" className="w-full">
        <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b">
          <TabsTrigger
            value="post"
            className="px-8 py-3 rounded-none data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
          >
            <span className="flex items-center gap-2">
              <List className="h-5 w-5" />
              Post
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="images"
            className="px-8 py-3 rounded-none data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
          >
            <span className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Images & Video
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="link"
            className="px-8 py-3 rounded-none data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
          >
            <span className="flex items-center gap-2">
              <Link className="h-5 w-5" />
              Link
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="poll"
            className="px-8 py-3 rounded-none data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
          >
            <span className="flex items-center gap-2">
              <ListOrdered className="h-5 w-5" />
              Poll
            </span>
          </TabsTrigger>
        </TabsList>

        <div className="bg-white p-4 rounded-b-lg border border-t-0">
          <Input
            placeholder="Title"
            className="mb-4"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={300}
          />
          <div className="text-xs text-right text-gray-500 -mt-3 mb-2">
            {title.length}/300
          </div>

          <TabsContent value="post" className="m-0">
            <NotePicker />
          </TabsContent>

          <TabsContent value="images" className="m-0">
            <div className="border-2 border-dashed rounded-md p-8 text-center">
              <p className="text-gray-500 mb-4">Drag and drop images or</p>
              <Button>Upload</Button>
            </div>
          </TabsContent>

          <TabsContent value="link" className="m-0">
            <Input placeholder="Url" className="mb-4" />
          </TabsContent>

          <TabsContent value="poll" className="m-0">
            <div className="mb-4">
              {pollOptions.map((option, index) => (
                <Input
                  key={index}
                  placeholder={`Option ${index + 1}`}
                  className="mb-2"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...pollOptions];
                    newOptions[index] = e.target.value;
                    setPollOptions(newOptions);
                  }}
                />
              ))}
              <Button
                variant="ghost"
                className="text-blue-500"
                onClick={() => setPollOptions([...pollOptions, ""])}
              >
                Add Option
              </Button>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm">Voting length:</span>
              <Select defaultValue="3">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 day</SelectItem>
                  <SelectItem value="3">3 days</SelectItem>
                  <SelectItem value="7">7 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <div className="flex gap-2 mb-4">
            <Button variant="outline" size="sm">
              OC
            </Button>
            <Button variant="outline" size="sm">
              Spoiler
            </Button>
            <Button variant="outline" size="sm">
              NSFW
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              Flair
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Checkbox id="notifications" />
            <label htmlFor="notifications" className="text-sm">
              Send me post reply notifications
            </label>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline">Save Draft</Button>
            <Button>Post</Button>
          </div>
        </div>
      </Tabs>
    </div>
  );
}

// I have updated the ui part for the create post. I need your help to add functionalities for bold, italics, list etc (others mentioned)
