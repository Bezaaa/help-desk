/* eslint-disable @typescript-eslint/no-explicit-any */
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { NotificationCenter } from "./NotificationCenter";


export async function TopNav({ user }: { user: any }) {
  // 1. Fetch real notifications from the database for the current user
  const notifications = await db.notification.findMany({
    where: { 
      userId: user.id 
    },
    orderBy: { 
      createdAt: "desc" 
    },
    take: 10 // Only show the last 10
  });

  return (
    <header className="h-16 border-b border-zinc-800 bg-black/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
      {/* Search Bar */}
      <div className="relative w-96 group">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500 group-focus-within:text-indigo-500 transition-colors" />
        <Input
          type="search"
          placeholder="Search system records..."
          className="pl-8 bg-zinc-900/50 border-zinc-800 text-zinc-200 focus:ring-indigo-500/20 placeholder:text-zinc-600"
        />
      </div>

      <div className="flex items-center gap-6">
        {/* THE NOTIFICATION BELL */}
        <NotificationCenter notifications={notifications} />

        {/* User Profile Info */}
        <div className="flex items-center gap-3 pl-6 border-l border-zinc-800">
          <div className="text-right">
            <p className="text-sm font-bold text-zinc-200 leading-none mb-1">{user.name}</p>
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none">
              {user.role}
            </p>
          </div>
          <div className="h-9 w-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 font-bold">
            {user.name?.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
}