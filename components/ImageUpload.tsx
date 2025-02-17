"use client"
import React, {useState} from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button';
import { NextResponse } from 'next/server';

interface TitleProps {
  title: string;
  count: number;
}

const ImageUpload: React.FC<TitleProps> = ({title, count}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [imageFiles, setImageFiles] = useState<File>();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
    if(e.target.files && e.target.files[0]){
      // const ImageArray = Array.from(e.target.files)

      setImageFiles(e.target.files[0]);
    }
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("type", "image");
    
    if(imageFiles) {
      formData.append("file",imageFiles);
    }

    try {
      const response = await fetch("/api/posts/images" , {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if(response.ok) {
        alert("Image uploaded");
        console.log("Image Uploaded successfully", data);
        return NextResponse.json({
          message: "Image uploaded successfully"
        }, { status: 200});
      } else {
        console.error("Error in uploading", data.message);
      }
    } catch (error:unknown){
      console.log("Error occurred", error);
      alert("Error occurred");
      return NextResponse.json({
        message: "Error occurred"
      }, { status: 400})
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <>
     <div className="border-2 border-dashed rounded-md p-8 text-center">
              <p className="text-gray-500 mb-4">Drag and drop images or</p>
              <Input type="file" accept="image/*" onChange={handleImageChange} />
            </div>

            <div className="flex justify-end gap-2">
            <Button variant="outline">Save Draft</Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? "Posting..." : "Post"}</Button>
          </div>
    </>
  )
}

export default ImageUpload