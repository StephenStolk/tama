'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
      <form className="max-w-md mx-auto space-y-4">
        {/* Email */}
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            className="mt-1"
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
            required
          />
        </div>

        {/* Login Button */}
        <Button type="submit" className="w-full">
          Login
        </Button>

        {/* Create Account */}
        <p className="text-center mt-4 text-sm text-gray-600">
          Don’t have an account?{" "}
          <a href="/signup" className="text-red-500 hover:underline">
            Create Account
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
