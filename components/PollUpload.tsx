"use client"

import React, {useState} from 'react'
import { Input } from './ui/input'

import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { NextResponse } from 'next/server'

interface TitleProps {
    title: string;
    count: number;
}

const PollUpload: React.FC<TitleProps> = ({title, count}) => {

    const [votingLength, setVotingLength] = useState("3")
    const [pollOptions, setPollOptions] = useState(["", ""])
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("type", "poll");


        const formattedPollOptions = pollOptions.map(option => ({
            option,
            votes: 0,
          }));

          formData.append("pollOptions", JSON.stringify(formattedPollOptions));
          formData.append("votingLength", votingLength);

          try {
            const response = await fetch("/api/posts/polls", {
                method: "POST",
                body: formData,
            })

            console.log(formData);

            if(response.ok) {
                console.log("Poll created successfully");
                alert("Poll created successfully");
                return NextResponse.json({
                    message: "Poll Post created successfully", status: 200
                })
            }

          } catch (error:unknown){
            console.log(error);
            return NextResponse.json({
                message: "Error in creating post", error,
                status: 400
            })
          }
        return;
    }
  return (
    <>
     {pollOptions.map((option, index) => (
              <Input
                key={index}
                placeholder={`Option ${index + 1}`}
                className="mb-2"
                value={option}
                onChange={(e) => {
                  const newOptions = [...pollOptions]
                  newOptions[index] = e.target.value
                  setPollOptions(newOptions)
                }}
              />
            ))}
            <Button variant="ghost" className="text-blue-500" onClick={() => setPollOptions([...pollOptions, ""])}>
              Add Option
            </Button>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm">Voting length:</span>
              <Select defaultValue="3" onValueChange={setVotingLength}>
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
            <div className="flex justify-end gap-2">
            <Button variant="outline">Save Draft</Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? "Posting..." : "Post"}</Button>
          </div>
    </>
  )
}

export default PollUpload