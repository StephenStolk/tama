// "use client";

// import React from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox";

// const Page: React.FC = () => {
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold text-center mb-6">Sign Up</h1>
//       <form className="max-w-md mx-auto space-y-4">
//         {/* Username */}
//         <div>
//           <Label htmlFor="username">Username</Label>
//           <Input
//             type="text"
//             id="username"
//             name="username"
//             placeholder="Enter your username"
//             className="mt-1"
//             required
//           />
//         </div>

//         {/* Bio */}
//         <div>
//           <Label htmlFor="bio">Bio</Label>
//           <Textarea
//             id="bio"
//             name="bio"
//             placeholder="Tell us something about yourself"
//             className="mt-1"
//             rows={3}
//           />
//         </div>

//         {/* Email */}
//         <div>
//           <Label htmlFor="email">Email Address</Label>
//           <Input
//             type="email"
//             id="email"
//             name="email"
//             placeholder="Enter your email"
//             className="mt-1"
//             required
//           />
//         </div>

//         {/* Password */}
//         <div>
//           <Label htmlFor="password">Password</Label>
//           <Input
//             type="password"
//             id="password"
//             name="password"
//             placeholder="Enter your password"
//             className="mt-1 mb-6 sm:mb-2"
//             required
//           />
//         </div>

//         {/* Terms & Conditions */}
//         <div className="flex items-center space-x-2">
//           <Checkbox id="terms" name="terms" required />
//           <Label htmlFor="terms">
//             I agree to the{" "}
//             <a href="#" className="underline">
//               Terms & Conditions
//             </a>
//           </Label>
//         </div>

//         {/* Submit Button */}
//         <Button type="submit" className="w-full">
//           Sign Up
//         </Button>

//         {/* Switch to Login */}
//         <p className="text-center mt-4 text-sm text-gray-600">
//           Already have an account?{" "}
//           <a href="/login" className="text-red-500 hover:underline">
//             Login here
//           </a>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Page;

// app/signup/page.tsx

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";
import validator from "validator";
import Link from "next/link";

const Page: React.FC = () => {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Basic client-side validation
    if (!username || !bio || !email || !password || !terms) {
      setError("Please fill out all fields and agree to the terms.");
      return;
    }

    if(username.length<3) {
      toast.error("The username should have atleast 3 characters.")
      return;
    }

    if (!validator.isEmail(email)) {
      toast.error("Please provide correct email.")
        return;
      }

    if(password.length < 6){
      toast.error("The password should have a minimum length of 6.")
      // (error);
      return;
    }

    setLoading(true);
    setError("");
  
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          bio,
          email,
          password,
        }),
      });
  
      if (response.ok || response.status === 201) {
        // Handle success (using React Toastify for success message)
        toast.success("Sign up successful!");  // Show success notification
        router.push("/login")
      } else {
        const data = await response.json();
        setError(data.message || "An error occurred. Please try again.");
        toast.error(data.message || "An error occurred. Please try again.");  // Show error notification
      }
    } catch (err: unknown) {
      setError("Failed to connect to the server.");
      toast.error("Failed to connect to the server.");  // Show error notification
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 pt-20">
      <h1 className="text-3xl font-bold text-center mb-6">Sign Up</h1>
      <form className="max-w-md mx-auto space-y-4" onSubmit={handleSubmit}>
        {/* Username */}
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            className="mt-1"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        {/* Bio */}
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            placeholder="Tell us something about yourself"
            className="mt-1"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            className="mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            className="mt-1 mb-6 sm:mb-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Terms & Conditions */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            name="terms"
            checked={terms} // Bind to terms state
            onCheckedChange={(checked) => setTerms(checked)} // Update terms state
            required
          />
          <Label htmlFor="terms">
            I agree to the{" "}
            <a href="#" className="underline">
              Terms & Conditions
            </a>
          </Label>
        </div>

        {/* Error message */}
        {error && <div className="text-red-500 text-center mt-2">{error}</div>}

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </Button>

        {/* Switch to Login */}
        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-black font-medium underline underline-offset-1">Login here</Link>
        </p>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Page;
