"use client";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { NextResponse } from "next/server";
import TagPicker from "./AddTags";

interface TitleProps {
  title: string;
  count: number;
}

const VideoUpload: React.FC<TitleProps> = ({ title, count }) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("type", "video");
    if (videoFile) {
      formData.append("file", videoFile);
    }

    formData.append("tags", JSON.stringify(tags));

    if (!videoFile) {
      return NextResponse.json({
        message: "Upload a video please",
        status: 400,
      });
    }

    try {
      const response = await fetch("/api/posts/videos", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Video Uploaded successfully", data);
        alert("Video Uploaded successfully");
      } else {
        console.log("Error in uploading video.", data.message);
      }
    } catch (error: unknown) {
      console.log(error);
      return NextResponse.json(
        {
          message: "",
        },
        { status: 400 }
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <div className="border-2 border-dashed rounded-md p-8 text-center">
        <p className="text-gray-500 mb-4">Drag and drop videos</p>
        <Input
          type="file"
          accept="video/*"
          className="hover:cursor-pointer border-r-solid"
          onChange={handleVideoChange}
        />
      </div>

      <div className="flex justify-end gap-2 mt-2">
        <Button variant="outline">Save Draft</Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Posting..." : "Post"}
        </Button>
      </div>

      <TagPicker tags={tags} setTags={setTags} />
    </>
  );
};

export default VideoUpload;
