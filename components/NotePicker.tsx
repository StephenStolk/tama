"use client"
import React, { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import Tiptap to avoid SSR issues
const Tiptap = dynamic(() => import("./Tiptap"), { ssr: false });

const NotePicker = () => {
    const [content, setContent] = useState<string>("");

    const handleContentChange = (newContent: string) => {
        setContent(newContent);
    };

    return (
        <>
            <form className="max-w-3xl w-full grid place-items-center mx-auto pt-10 mb-10">
                <Tiptap content={content} onChange={handleContentChange} />
                
            </form>
        </>
    );
};

export default NotePicker;
