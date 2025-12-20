"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";
import { Loader2, Mail, Lock, User, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { registerUser } from "@/actions/authActions";
import { RegisterInput, registerSchema } from "@/lib/schema";
import { useTransition } from "react";

export const RegisterForm = () => {
  const [isPending, startTransition] = useTransition();
  const form = useForm<RegisterInput>({ 
    resolver: zodResolver(registerSchema), 
    defaultValues: { name: "", email: "", password: "" } 
  });

  const onSubmit = async (values: RegisterInput) => {
    startTransition(async () => {
      const result = await registerUser(values);
      if (result.success) {
        toast.success("Account created! You can now log in.");
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <Card className="w-full max-w-md border-zinc-800 bg-zinc-900/50 backdrop-blur-xl shadow-xl">
      <CardHeader className="text-center">
        <div className="mx-auto bg-indigo-600/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 border border-indigo-500/20">
          <UserPlus className="text-indigo-500 h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-bold text-white">Create an account</CardTitle>
        <CardDescription className="text-zinc-400">Join the support platform to get help</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-300">Full Name</FormLabel>
                <div className="relative group">
                  <User className="absolute left-3 top-3 h-4 w-4 text-zinc-500 group-focus-within:text-indigo-500 transition-colors" />
                  <FormControl>
                    <Input {...field} placeholder="John Doe" disabled={isPending} className="pl-10 bg-zinc-950 border-zinc-800 text-white focus:ring-1 focus:ring-indigo-500" />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-300">Email</FormLabel>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500 group-focus-within:text-indigo-500 transition-colors" />
                  <FormControl>
                    <Input {...field} placeholder="name@company.com" disabled={isPending} className="pl-10 bg-zinc-950 border-zinc-800 text-white focus:ring-1 focus:ring-indigo-500" />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-300">Password</FormLabel>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500 group-focus-within:text-indigo-500 transition-colors" />
                  <FormControl>
                    <Input {...field} type="password" placeholder="••••••••" disabled={isPending} className="pl-10 bg-zinc-950 border-zinc-800 text-white focus:ring-1 focus:ring-indigo-500" />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )} />
            <Button type="submit" disabled={isPending} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-6 cursor-pointer">
              {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign Up"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-center border-t border-zinc-800 pt-6">
        <p className="text-sm text-zinc-500">
          Already have an account? <Link href="/login" className="text-indigo-400 hover:underline cursor-pointer">Log in</Link>
        </p>
      </CardFooter>
    </Card>
  );
};