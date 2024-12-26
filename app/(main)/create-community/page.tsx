'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function CreateCommunityPage() {
  const [community, setCommunity] = useState({
    name: '',
    description: '',
    type: 'public',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCommunity({ ...community, [e.target.name]: e.target.value })
  }

  const handleTypeChange = (value: string) => {
    setCommunity({ ...community, type: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the community data to your backend
    console.log('New community:', community)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create a New Community</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Community Name</Label>
              <Input
                id="name"
                name="name"
                value={community.name}
                onChange={handleChange}
                placeholder="r/"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={community.description}
                onChange={handleChange}
                rows={4}
                placeholder="What's this community about?"
              />
            </div>
            <div className="space-y-2">
              <Label>Community Type</Label>
              <RadioGroup value={community.type} onValueChange={handleTypeChange}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="public" />
                  <Label htmlFor="public">Public</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="restricted" id="restricted" />
                  <Label htmlFor="restricted">Restricted</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="private" />
                  <Label htmlFor="private">Private</Label>
                </div>
              </RadioGroup>
            </div>
            <Button type="submit">Create Community</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

