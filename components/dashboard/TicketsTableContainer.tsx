/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { TicketTable } from "./TicketTable";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ContainerProps {
  searchParams: { 
    page?: string; 
    q?: string; 
    priority?: string 
  };
}

export async function TicketsTableContainer({ searchParams }: ContainerProps) {
  // 1. Setup session and params
  const session = await auth();
  const userId = session?.user?.id;
  const userRole = session?.user?.role;
  
  const currentPage = Number(searchParams.page) || 1;
  const query = searchParams.q || "";
  const priorityFilter = searchParams.priority || "";
  const pageSize = 5;
  const skip = (currentPage - 1) * pageSize;

  // 2. Build the specific where clause for the list
  const whereClause: any = {
    ...(userRole === "ADMIN" ? {} : { userId }),
    ...(priorityFilter && priorityFilter !== "ALL" ? { priority: priorityFilter } : {}),
    ...(query ? {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ]
    } : {}),
  };

  // 3. Fetch data in parallel (Tickets + Total Count for pagination)
  const [tickets, filteredCount] = await Promise.all([
    db.ticket.findMany({
      where: whereClause,
      include: { user: true },
      orderBy: { createdAt: "desc" },
      skip: skip,
      take: pageSize,
    }),
    db.ticket.count({ where: whereClause }),
  ]);

  const totalPages = Math.ceil(filteredCount / pageSize);

  return (
    <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-[2.5rem] overflow-hidden backdrop-blur-sm shadow-2xl">
      {/* THE ACTUAL TABLE (Client Component) */}
      <div className="min-h-[400px]">
        <TicketTable tickets={tickets} userRole={userRole} />
      </div>

      {/* PAGINATION FOOTER */}
      <div className="p-6 border-t border-zinc-800/50 bg-zinc-900/20 flex items-center justify-between">
        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
          Showing Page {currentPage} of {totalPages || 1}
        </p>
        <div className="flex gap-2">
          <Link
            href={`/dashboard?page=${currentPage - 1}&q=${query}&priority=${priorityFilter}`}
            className={cn(
              "flex items-center gap-1 px-5 py-2.5 bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-xl text-[10px] font-black uppercase transition-all hover:bg-indigo-600 hover:border-indigo-500 cursor-pointer",
              currentPage <= 1 && "pointer-events-none opacity-20"
            )}
          >
            <ChevronLeft className="h-3 w-3" /> Prev
          </Link>
          <Link
            href={`/dashboard?page=${currentPage + 1}&q=${query}&priority=${priorityFilter}`}
            className={cn(
              "flex items-center gap-1 px-5 py-2.5 bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-xl text-[10px] font-black uppercase transition-all hover:bg-indigo-600 hover:border-indigo-500 cursor-pointer",
              currentPage >= totalPages && "pointer-events-none opacity-20"
            )}
          >
            Next <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}