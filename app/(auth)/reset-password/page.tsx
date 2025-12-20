"use client";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { requestPasswordReset } from "@/actions/authActions";

export default function RequestResetPage() {
  const [isPending, startTransition] = useTransition();

   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
console.log("form data",formData , e.currentTarget)
    startTransition(async () => {
      const result = await requestPasswordReset(email);
      
      if (result.success) {
        toast.success("If an account exists, a reset link has been sent.");
      } else {
        toast.error(result.error || "Something went wrong.");
      }
    });
  };
  return (
    <Card className="w-full max-w-md border-zinc-800 bg-zinc-900/50 backdrop-blur-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-white">Reset Password</CardTitle>
        <CardDescription>Enter your email to receive a recovery link</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500 group-focus-within:text-indigo-500" />
            <Input placeholder="name@company.com" type="email" required className="pl-10 bg-zinc-950 border-zinc-800 text-white" name='email' />
          </div>
          <Button disabled={isPending} className="w-full bg-indigo-600 hover:bg-indigo-700 cursor-pointer">
            {isPending ? <Loader2 className="animate-spin h-5 w-5" /> : "Send Reset Link"}
          </Button>
          <div className="text-center mt-4">
            <Link href="/login" className="text-sm text-zinc-500 hover:text-indigo-400 cursor-pointer" >Back to Login</Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}