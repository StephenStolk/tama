"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Eye } from "lucide-react"

interface BugReport {
  id: string
  title: string
  description: string
  status: "open" | "in-progress" | "resolved" | "closed"
  createdAt: string
  userEmail?: string
}

export default function BugReportAdminPage() {
  const [bugReports, setBugReports] = useState<BugReport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBugReports = async () => {
      try {
        const response = await fetch("/api/bugs/report", {
          credentials: "include",
        })

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("You are not authorized to view this page")
          }
          throw new Error("Failed to fetch bug reports")
        }

        const data = await response.json()
        setBugReports(data.bugReports)
      } catch (error) {
        console.error("Error fetching bug reports:", error)
        setError(error instanceof Error ? error.message : "Failed to load bug reports. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBugReports()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800 border-red-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200"
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (isLoading) {
    return (
      <div className="w-full mx-auto md:pl-80 py-20">
        <Card className="w-full border p-4 border-gray-200 shadow-sm">
          <CardContent className="p-4 flex justify-center items-center min-h-[300px]">
            <p>Loading bug reports...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full mx-auto md:pl-80 py-20">
        <Card className="w-full border p-4 border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
              <div>
                <h3 className="text-red-800 font-medium">Error</h3>
                <p>{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full mx-auto md:pl-80 py-20">
      <Card className="w-full border p-2 md:p-4 border-gray-200 shadow-sm">
        <CardHeader className="p-4 border-b border-gray-100">
          <h1 className="text-2xl font-bold">Bug Reports Admin</h1>
          <p className="text-sm text-gray-500">Manage and track all reported bugs</p>
        </CardHeader>

        <CardContent className="p-4">
          {bugReports.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No bug reports found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Reported On
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Reported By
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bugReports.map((report) => (
                    <tr key={report.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(report.status)}`}
                        >
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.userEmail || "Anonymous"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

