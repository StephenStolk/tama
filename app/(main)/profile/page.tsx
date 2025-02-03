// 'use client'

// import { useState } from 'react'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// export default function ProfilePage() {
//   const [user, setUser] = useState({
//     username: 'johndoe',
//     email: 'john@example.com',
//     bio: 'I love Reddit!',
//   })

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setUser({ ...user, [e.target.name]: e.target.value })
//   }

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     // Here you would typically send the updated user data to your backend
//     console.log('Updated user:', user)
//   }

//   return (
//     <div className="max-w-2xl mx-auto">
//       <Card>
//         <CardHeader>
//           <CardTitle>Edit Profile</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="flex items-center space-x-4">
//               <Avatar className="w-20 h-20">
//                 <AvatarImage src="/placeholder-user.jpg" alt="User" />
//                 <AvatarFallback>JD</AvatarFallback>
//               </Avatar>
//               <Button variant="outline">Change Avatar</Button>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="username">Username</Label>
//               <Input
//                 id="username"
//                 name="username"
//                 value={user.username}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 name="email"
//                 type="email"
//                 value={user.email}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="bio">Bio</Label>
//               <Textarea
//                 id="bio"
//                 name="bio"
//                 value={user.bio}
//                 onChange={handleChange}
//                 rows={4}
//               />
//             </div>
//             <Button type="submit">Save Changes</Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "@/app/(main)/profile/Profile.css"

export default function ProfilePage() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    bio: "",
  })
  const [loading, setLoading] = useState(true)
  const [successMessage, setSuccessMessage] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user", {
          method: "GET",
          credentials: "include", // This ensures cookies are sent with the request
        })
        const data = await response.json()

        if (response.ok) {
          setUser(data.user)
        } else {
          console.error("Failed to fetch user data", data.message)
          if (response.status === 401) {
            // Redirect to login if unauthorized
            router.push("/login")
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccessMessage("")

    try {
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // This ensures cookies are sent with the request
        body: JSON.stringify({
          username: user.username,
          bio: user.bio,
        }),
      })
      const data = await response.json()

      if (response.ok) {
        // console.log("User updated successfully:", data)
        setSuccessMessage("Your profile has been updated successfully!")
        toast.success("Profile updated successfully!")
      } else {
        console.error("Failed to update user:", data.message)
        toast.error("Failed to update profile. Please try again.")
      }
    } catch (error) {
      console.error("Error updating user:", error)
      toast.error("Error updating profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {successMessage && <div className="mb-4 text-green-600">{successMessage}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <Button variant="outline">Change Avatar</Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" value={user.username} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={user.email} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" name="bio" value={user.bio} onChange={handleChange} rows={4} />
            </div>
            <Button type="submit">Save Changes</Button>
          </form>
        </CardContent>
      </Card>
      <ToastContainer />
    </div>
  )
}

