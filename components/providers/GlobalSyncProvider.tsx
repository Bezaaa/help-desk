'use client'
import { useRouter } from "next/navigation";
import { useTransition } from "react"; 
import { useBroadcast } from "@/hooks/useBroadcast";

export function GlobalSyncProvider() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition(); 

  useBroadcast("ticket_updates", (message) => {
    if (message.type === "TICKET_MUTATED") {
      console.log("📥 Signal received. Forcing sync...");
      
      startTransition(() => {
        router.refresh();
      });
    }
  });

  return null;
}