"use client"
import React, { ChangeEvent, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { NextResponse } from "next/server";
import { useRouter } from "next/navigation";
import TagPicker from "./AddTags";

// Dynamically import Tiptap to avoid SSR issues
const Tiptap = dynamic(() => import("./Tiptap"), { ssr: false });

interface TitleProps {
    title: string;
    count: number;
}
const NotePicker: React.FC<TitleProps> = ({title, count}) => {
    const [content, setContent] = useState<string>("");
     const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
     const [imageFile, setImageFile] = useState<File | null>(null);
     const [dataUpdated, setDataUpdated] = useState<boolean>(false);
     const router = useRouter();
     const [tags, setTags] = useState<string[]>([]);

     useEffect(() => {
        if(dataUpdated) {
            router.refresh();
        }
     }, [dataUpdated, router])

    const handleContentChange = (newContent: string) => {
        setContent(newContent);
    };

    function handleImageChange(event: ChangeEvent<HTMLInputElement>): void {
        // throw new Error("Function not implemented.");
        if(event.target.files && event.target.files[0]) {
            setImageFile(event.target.files[0]);
        }
    };

    
    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append("title",title);
        formData.append("content", content);
        formData.append("tags", JSON.stringify(tags));
        if(imageFile) {
            formData.append("file",imageFile);
        }

        try {
            const response = await fetch("/api/posts/post", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if(response.ok) {
                //alert("Post created successfully");
                console.log("Post: ", data.post);
                setDataUpdated(true);
                router.push("/");
            } else {
                console.error("Error creating post:", data.message);
        alert("Failed to create post");
            }
        } catch (error: unknown) {
            alert("Error in creating post");
            console.log(error);
            return NextResponse.json({
                message: "Error in creating post",
                status: 404
            });
        } finally {
            setIsSubmitting(false);
            // router.push("/");
            // title = "";
            
        }
    };

    return (
        <>
        <form className="max-w-3xl w-full grid place-items-center mx-auto pt-10 mb-10" onSubmit={handleSubmit}>
          <Tiptap content={content} onChange={handleContentChange} />
        </form>
  
        <div className="border-2 border-dashed rounded-md p-8 text-center">
          <p className="text-gray-500 mb-4">Drag and drop images (Optional)</p>
          <Input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
  
        <div className="flex justify-end gap-2">
          <Button variant="outline">Save Draft</Button>
          <Button type="submit" disabled={isSubmitting} onClick={handleSubmit}>
            {isSubmitting ? "Posting..." : "Post"}
          </Button>
        </div>

        <TagPicker tags={tags} setTags={setTags} />
      </>
    );
};

export default NotePicker;
