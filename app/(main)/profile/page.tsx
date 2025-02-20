"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import { Pencil } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import "@/app/(main)/profile/Profile.css";

export default function ProfilePage() {
  const [user, setUser] = useState({ username: "", email: "", bio: "" });
  const [originalUser, setOriginalUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();

        if (response.ok) {
          setUser(data.user);
          setOriginalUser(data.user); // Store original data for cancel
        } else {
          console.error("Failed to fetch user data", data.message);
          if (response.status === 401) router.push("/login");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: user.username, bio: user.bio }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("username", user.username);
        document.cookie = `username=${user.username}; path=/`;

        setIsEditing(false);
        setOriginalUser(user);
        window.location.reload();
      } else {
        console.error("Failed to update user:", data.message);
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Error updating profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setUser(originalUser); // Restore original data
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl pt-20 mx-auto">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-20 h-20">
                <AvatarFallback>
                  {user.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {!isEditing ? (
                <Button variant="outline" onClick={handleEdit}>
                  <Pencil className="h-4 w-4" />
                  Edit Profile
                </Button>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={user.username}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={user.email}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={user.bio}
                onChange={handleChange}
                rows={4}
                disabled={!isEditing}
              />
            </div>

            {isEditing ? (
              <div className="flex space-x-2">
                <Button type="submit">Save Changes</Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            ) : null}
          </form>
        </CardContent>
      </Card>
      <ToastContainer />
    </div>
  );
}
