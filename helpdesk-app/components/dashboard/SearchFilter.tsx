"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, Loader2 } from "lucide-react";
import { useTransition, useCallback } from "react";

export function SearchFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();


  const updateFilters = useCallback((name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value && value !== "ALL") {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    
  
    params.set("page", "1");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }, [searchParams, pathname, router]);

  const clearFilters = () => {
    startTransition(() => {
      router.push(pathname);
    });
  };

  const hasFilters = searchParams.get("q") || searchParams.get("priority");

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
      {/* 1. SEARCH INPUT */}
      <div className="relative flex-1 w-full group">
        <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500 group-focus-within:text-indigo-500 transition-colors" />
        <Input
          placeholder="Filter by subject or description..."
          defaultValue={searchParams.get("q") || ""}
          onChange={(e) => updateFilters("q", e.target.value)}
          className="pl-10 bg-zinc-950 border-zinc-800 text-white focus:ring-1 focus:ring-indigo-500/50"
        />
      </div>

      {/* 2. PRIORITY SELECT */}
      <Select 
        defaultValue={searchParams.get("priority") || "ALL"} 
        onValueChange={(val) => updateFilters("priority", val)}
      >
        <SelectTrigger className="w-full md:w-[180px] bg-zinc-950 border-zinc-800 text-zinc-300">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
          <SelectItem value="ALL">All Priorities</SelectItem>
          <SelectItem value="HIGH">High Priority</SelectItem>
          <SelectItem value="MEDIUM">Medium Priority</SelectItem>
          <SelectItem value="LOW">Low Priority</SelectItem>
        </SelectContent>
      </Select>

      {/* 3. RESET BUTTON & LOADING INDICATOR */}
      <div className="flex items-center gap-4 min-w-[100px]">
        {hasFilters && (
          <button 
            onClick={clearFilters}
            className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-rose-500 flex items-center gap-1 transition-colors"
          >
            <X className="h-3 w-3" /> Reset
          </button>
        )}
        
        {isPending && (
          <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
        )}
      </div>
    </div>
  );
}