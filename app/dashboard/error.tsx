"use client"; 

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
   
    console.error("DASHBOARD_ERROR:", error);
  }, [error]);

  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-8 bg-zinc-950 rounded-[2.5rem] border border-red-900/20 shadow-2xl">
      <div className="h-16 w-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="h-8 w-8 text-red-500" />
      </div>
      
      <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">
        System <span className="text-red-500">Failure</span>
      </h2>
      
      <p className="text-zinc-400 text-center max-w-md mb-8 font-medium">
        An unexpected error occurred while fetching your data stream. 
        The incident has been logged.
      </p>

      <Button
        onClick={() => reset()} 
        className="bg-zinc-800 hover:bg-zinc-700 text-white px-8 rounded-xl flex items-center gap-2"
      >
        <RefreshCcw className="h-4 w-4" />
        Attempt Recovery
      </Button>
    </div>
  );
}