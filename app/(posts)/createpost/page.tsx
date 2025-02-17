// /createpost/page.tsx
"use client";

import { useState } from "react";
// import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown } from "lucide-react";
import NotePicker from "@/components/NotePicker";
import ImageUpload from "@/components/ImageUpload";
import VideoUpload from "@/components/VideoUpload";
import PollUpload from "@/components/PollUpload";
// import Cookies from "js-cookie";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [selectedTab, setSelectedTab] = useState("");
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

          <TabsContent value="images">
            <ImageUpload title={title} count={title.length} />
          </TabsContent>

          <TabsContent value="videos">
            <VideoUpload title={title} count={title.length}/>
          </TabsContent>

          <TabsContent value="poll" className="m-0">
            <PollUpload title={title} count={title.length} />
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

          
        </div>
      </Tabs>
    </div>
  );
}

// I have updated the ui part for the create post. I need your help to add functionalities for bold, italics, list etc (others mentioned)
