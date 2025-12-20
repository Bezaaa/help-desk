/* eslint-disable @typescript-eslint/no-explicit-any */

import { db } from "@/lib/db";

import { NotificationCenter } from "./NotificationCenter";


export async function TopNav({ user }: { user: any }) {
 
  const notifications = await db.notification.findMany({
    where: { 
      userId: user.id 
    },
    orderBy: { 
      createdAt: "desc" 
    },
    take: 10 
  });

  return (
    <header className="h-16 border-b border-zinc-800 bg-black/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
    
     

      <div className="flex items-center gap-6">
       
        <NotificationCenter notifications={notifications} />

     
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