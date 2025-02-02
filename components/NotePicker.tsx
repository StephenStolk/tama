"use client"
import React from 'react'
import { useState } from 'react'
import Tiptap from './Tiptap';

const NotePicker = () => {
    const [content,setContent] = useState<string>('');
    const handleContentChange = (reason: any) => {
        setContent(reason);
    }
  return (
    <>
    <form className="max-w-3xl w-full grid place-items-center mx-auto pt-10 mb-10">
        <Tiptap content={content} onChange={(newContent:string) => handleContentChange(newContent)} />
    </form>
    </>
  )
}

export default NotePicker