'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const Page: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Sign Up</h1>
      <form className="max-w-md mx-auto space-y-4">
        {/* Username */}
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            className="mt-1"
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
            required
          />
        </div>

        {/* Terms & Conditions */}
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" name="terms" required />
          <Label htmlFor="terms">
            I agree to the <a href="#" className="underline">Terms & Conditions</a>
          </Label>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          Sign Up
        </Button>

        {/* Switch to Login */}
        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-red-500 hover:underline">
            Login here
          </a>
        </p>
      </form>
    </div>
  );
};

export default Page;
