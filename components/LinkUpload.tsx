"use client"
import React , {useState} from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'

const LinkUpload = () => {
    const [linkUrl, setLinkUrl] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <>
    <Input placeholder="Url" className="mb-4" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />

    <div className="flex justify-end gap-2">
            <Button variant="outline">Save Draft</Button>
            <Button onClick={LinkUpload} disabled={isSubmitting}>{isSubmitting ? "Posting..." : "Post"}</Button>
          </div>
    </>
  )
}

export default LinkUpload