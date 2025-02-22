// 'use client';

// import React from 'react';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// const Login: React.FC = () => {
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
//       <form className="max-w-md mx-auto space-y-4">
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
//             className="mt-1"
//             required
//           />
//         </div>

//         {/* Login Button */}
//         <Button type="submit" className="w-full">
//           Login
//         </Button>

//         {/* Create Account */}
//         <p className="text-center mt-4 text-sm text-gray-600">
//           Don’t have an account?{" "}
//           <a href="/signup" className="text-red-500 hover:underline">
//             Create Account
//           </a>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Login;

'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
//import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import validator from "validator"
import Link from 'next/link';

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  //const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if(!email || !password){
      toast.error("Email and password are required.")
    }

    if (!validator.isEmail(email)) {
      toast.error("Please provide correct email format.")
        return;
      }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", 
      });

      const data = await response.json();
      if (response.ok) {
        const user = data.user;
        localStorage.setItem("username", user.username); // Save username
        localStorage.setItem("token", data.token); // Save token
        console.log(user);
        toast.success("Login successful!");
        window.location.href = "/";
      } else {
        setError(data.message || "An error occurred. Please try again.");
        toast.error(data.message || "An error occurred. Please try again.");
      }
    } catch (err:unknown) {
      setError("Failed to connect to the server.");
      toast.error("Failed to connect to the server.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 pt-20">
      <h1 className="text-3xl font-bold text-center text-black mb-6">Login</h1>
      <form className="max-w-md mx-auto space-y-4" onSubmit={handleSubmit}>
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
            className="mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Error message */}
        {error && <div className="text-red-500 text-center mt-2">{error}</div>}

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Logging In..." : "Login"}
        </Button>

        {/* Create Account */}
        <p className="text-center mt-4 text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link href="/signup" className='text-black underline underline-offset-1'>Sign up</Link>
        </p>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;

