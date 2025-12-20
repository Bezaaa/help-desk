"use client";

import { Suspense, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { updatePassword } from "@/actions/authActions";
import { toast } from "sonner";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";

 function NewPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  

  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    if (!token) {
      return toast.error("Security token is missing.");
    }

    startTransition(async () => {
      const res = await updatePassword(token, password);
      if (res.success) {
        toast.success("Security credentials updated. You may now login.");
        router.push("/login");
      } else {
        toast.error(res.error);
      }
    });
  };

  return (
    <Card className="w-full max-w-md border-zinc-800 bg-zinc-900/50 backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in duration-500">
      <CardHeader className="text-center">
        <div className="mx-auto bg-indigo-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 border border-indigo-500/20">
          <ShieldCheck className="text-indigo-500 h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-black text-white uppercase tracking-tighter">Update Password</CardTitle>
        <CardDescription className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
          Secure your operator account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">New Password</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
              <Input 
                name="password" 
                type="password" 
                placeholder="••••••••" 
                required 
                disabled={isPending}
                className="pl-10 bg-zinc-950 border-zinc-800 text-white focus:ring-1 focus:ring-indigo-500" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Confirm Password</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
              <Input 
                name="confirmPassword" 
                type="password" 
                placeholder="••••••••" 
                required 
                disabled={isPending}
                className="pl-10 bg-zinc-950 border-zinc-800 text-white focus:ring-1 focus:ring-indigo-500" 
              />
            </div>
          </div>

          <Button disabled={isPending} className="w-full bg-indigo-600 hover:bg-indigo-700 font-black uppercase tracking-tighter h-12 mt-2 cursor-pointer">
            {isPending ? <Loader2 className="animate-spin h-5 w-5" /> : "Save Changes"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center border-t border-zinc-800 py-4 ">
        <Link href="/login" className="text-[10px] font-black uppercase text-zinc-500 hover:text-indigo-400 transition-colors tracking-widest cursor-pointer">
          Abort Reset
        </Link>
      </CardFooter>
    </Card>
  );
}




export default function NewPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest text-center">
          Initializing Secure Session...
        </p>
      </div>
    }>
      <NewPasswordForm />
    </Suspense>
  );
}