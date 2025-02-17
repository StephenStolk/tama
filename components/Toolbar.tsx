import React from 'react'
import {
  Bold,
  Italic,
  Quote,
  ListOrdered,
  List,
  Strikethrough,
  Heading2,
  Heading1,
  Code,
  Undo,
  Redo,
  Underline
} from "lucide-react"
import { Button } from './ui/button'
import { Editor } from '@tiptap/react';

type Props = {
    editor: Editor | null;
    content: string;
}

const Toolbar = ({editor, content}: Props) => {
if(!editor) {
    return null;
}
  return (
    <>
    
<div className="border rounded-md p-2 mb-2">
<div className="flex gap-2 justify-center">
  <Button variant="ghost" size="sm" onClick={(e) => {
    e.preventDefault();
    editor.chain().focus().toggleBold().run();
  }} className={editor.isActive("bold") ? "bg-sky-700 text-white p-2 rounded-lg" : "text-sky-400"}>
    <Bold className="h-4 w-4" />
  </Button>
  <Button variant="ghost" size="sm" onClick={(e) => {
    e.preventDefault();
    editor.chain().focus().toggleItalic().run();
  }} className={editor.isActive("italic") ? "bg-sky-700 text-white p-2 rounded-lg" : "text-sky-400"}>
    <Italic className="h-4 w-4" />
  </Button>
  {/* <Button variant="ghost" size="sm" onClick={(e) => {
    e.preventDefault();
    editor.chain().focus().toggleBold().run();
  }} className={editor.isActive("bold") ? "bg-sky-700 text-white p-2 rounded-lg" : "text-sky-400"}>
    <Link className="h-4 w-4" />
  </Button> */}
  <Button variant="ghost" size="sm" onClick={(e) => {
    e.preventDefault();
    editor.chain().focus().toggleStrike().run();
  }} className={editor.isActive("strike") ? "bg-sky-700 text-white p-2 rounded-lg" : "text-sky-400"}>
    <Strikethrough className="h-4 w-4" />
  </Button>
  <Button variant="ghost" size="sm" onClick={(e) => {
    e.preventDefault();
    editor.chain().focus().toggleUnderline().run();
  }} className={editor.isActive("underline") ? "bg-sky-700 text-white p-2 rounded-lg" : "text-sky-400"}>
    <Underline className="h-4 w-4" />
  </Button>
  <Button variant="ghost" size="sm" onClick={(e) => {
    e.preventDefault();
    editor.chain().focus().toggleHeading({level: 1}).run();
  }} className={editor.isActive("heading", {level: 1}) ? "bg-sky-700 text-white p-2 rounded-lg" : "text-sky-400"}>
    <Heading1 className="h-4 w-4" />
  </Button>
  <Button variant="ghost" size="sm" onClick={(e) => {
    e.preventDefault();
    editor.chain().focus().toggleHeading({level: 2}).run();
  }} className={editor.isActive("heading", {level: 2}) ? "bg-sky-700 text-white p-2 rounded-lg" : "text-sky-400"}>
    <Heading2 className="h-4 w-4" />
  </Button>
  <Button variant="ghost" size="sm" onClick={(e) => {
    e.preventDefault();
    editor.chain().focus().toggleBlockquote().run();
  }} className={editor.isActive("blockquote") ? "bg-sky-700 text-white p-2 rounded-lg" : "text-sky-400"}>
    <Quote className="h-4 w-4" />
  </Button>
  <Button variant="ghost" size="sm" onClick={(e) => {
    e.preventDefault();
    editor.chain().focus().setCode().run();
  }} className={editor.isActive("code") ? "bg-sky-700 text-white p-2 rounded-lg" : "text-sky-400"}>
    <Code className="h-4 w-4" />
  </Button>
  <Button variant="ghost" size="sm" onClick={(e) => {
    e.preventDefault();
    editor.chain().focus().toggleOrderedList().run();
  }} className={editor.isActive("orderedList") ? "bg-sky-700 text-white p-2 rounded-lg" : "text-sky-400"}>
    <ListOrdered className="h-4 w-4" />
  </Button>

  <Button variant="ghost" size="sm" onClick={(e) => {
    e.preventDefault();
    editor.chain().focus().toggleBulletList().run();
  }} className={editor.isActive("bulletList") ? "bg-sky-700 text-white p-2 rounded-lg" : "text-sky-400"}>
    <List className="h-4 w-4" />
  </Button>

  <Button variant="ghost" size="sm" onClick={(e) => {
    e.preventDefault();
    editor.chain().focus().undo().run();
  }} className={editor.isActive("undo") ? "bg-sky-700 text-white p-2 rounded-lg" : "text-sky-400"}>
    <Undo className="h-4 w-4" />
  </Button>
  <Button variant="ghost" size="sm" onClick={(e) => {
    e.preventDefault();
    editor.chain().focus().redo().run();
  }} className={editor.isActive("redo") ? "bg-sky-700 text-white p-2 rounded-lg" : "text-sky-400"}>
    <Redo className="h-4 w-4" />
  </Button> 

  {/* <Button variant="ghost" size="sm" className={editor.isActive("bold") ? "bg-sky-700 text-white p-2 rounded-lg" : "text-sky-400"}>
    <Table className="h-4 w-4" />
  </Button>
  <Button variant="ghost" size="sm" className={editor.isActive("bold") ? "bg-sky-700 text-white p-2 rounded-lg" : "text-sky-400"}>
    <Video className="h-4 w-4" />
  </Button>
  <Button variant="ghost" size="sm" className={editor.isActive("bold") ? "bg-sky-700 text-white p-2 rounded-lg" : "text-sky-400"}>
    <RotateCcw className="h-4 w-4" />
  </Button> */}
</div>
{/* <Textarea
  placeholder="Text (optional)"
  value={content}
  onChange={(e) => setContent(e.target.value)}
  className="min-h-[200px]"
/> */}
</div>
    </>
  )
}

export default Toolbar