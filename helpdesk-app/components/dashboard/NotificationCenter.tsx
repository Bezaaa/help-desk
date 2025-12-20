/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Bell, Check, Info } from "lucide-react";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { markAsRead } from "@/actions/notificationActions";
import { cn } from "@/lib/utils";
import { useTransition } from "react";

export function NotificationCenter({ notifications }: { notifications: any[] }) {
  const [isPending, startTransition] = useTransition();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="flex items-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative h-10 w-10 rounded-full border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800"
          >
            <Bell className={cn(
              "h-5 w-5",
              unreadCount > 0 ? "text-indigo-400" : "text-zinc-500"
            )} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-indigo-500 rounded-full border-2 border-black animate-pulse" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          align="end" 
          sideOffset={8}
          className="w-80 p-0 bg-zinc-950 border-zinc-800 shadow-2xl z-[100]"
        >
          <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Notifications</h4>
            <span className="text-[10px] font-mono text-zinc-500">{unreadCount} New</span>
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-10 text-center text-zinc-600 text-[10px] uppercase font-bold tracking-widest">
                No active signals.
              </div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n.id} 
                  className={cn(
                    "p-4 border-b border-zinc-800/50 flex gap-3 transition-colors",
                    !n.isRead ? "bg-indigo-500/5" : "opacity-40"
                  )}
                >
                  <div className="mt-1">
                    {n.type === "SUCCESS" ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Info className="h-4 w-4 text-indigo-500" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-[11px] text-zinc-300 leading-snug">{n.message}</p>
                    {!n.isRead && (
                      <button 
                        onClick={() => startTransition(() => markAsRead(n.id))}
                        disabled={isPending}
                        className="text-[9px] text-indigo-400 font-bold hover:text-indigo-300 uppercase tracking-tighter"
                      >
                        {isPending ? "Clearing..." : "Mark as read"}
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}