"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function ReportBugPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null)
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !description.trim()) {
      setSubmitStatus("error")
      setErrorMessage("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch("/api/bugs/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title,
          description,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to submit bug report")
      }

      setSubmitStatus("success")
      setTitle("")
      setDescription("")
    } catch (error) {
      console.error("Error submitting bug report:", error)
      setSubmitStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Failed to submit bug report. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full mx-auto md:pl-80 py-20">
      <Card className="w-full border p-2 md:p-4 border-gray-200 shadow-sm">
        <CardHeader className="p-4 border-b border-gray-100">
          <h1 className="text-2xl font-bold">Report a Bug</h1>
          <p className="text-sm text-gray-500">Help us improve by reporting any issues you encounter</p>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="p-4 space-y-4">
            {submitStatus === "success" && (
              <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                <div>
                  <h3 className="text-green-800 font-medium">Success</h3>
                  <p>Your bug report has been submitted successfully. Thank you for helping us improve!</p>
                </div>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                <div>
                  <h3 className="text-red-800 font-medium">Error</h3>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-gray-900">
                Bug Title <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                placeholder="Enter a descriptive title for the bug"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-gray-900">
                Bug Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="description"
                placeholder="Please describe the bug in detail. Include steps to reproduce, expected behavior, and actual behavior."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full min-h-[200px]"
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end p-4 border-t border-gray-100">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Bug Report"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

