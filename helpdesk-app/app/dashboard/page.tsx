/* eslint-disable @typescript-eslint/no-explicit-any */
export const revalidate = 0;

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Ticket, 
  Clock, 
  CheckCircle, 
 
  Activity, 
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard
} from "lucide-react";
import { CreateTicketModal } from "@/components/dashboard/CreateTicketModal";
import { TicketTable } from "@/components/dashboard/TicketTable";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { SearchFilters } from "@/components/dashboard/SearchFilter";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    page?: string; 
    q?: string; 
    priority?: string 
  }>;
}) {
 
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams.page) || 1;
  const query = resolvedParams.q || "";
  const priorityFilter = resolvedParams.priority || "";
  
  const pageSize = 5;
  const skip = (currentPage - 1) * pageSize;

  const session = await auth();
  const userId = session?.user?.id;
  const userRole = session?.user?.role;


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


  const [tickets, filteredCount, totalInSystem, inProgressCount, resolvedCount] = await Promise.all([
   
    db.ticket.findMany({
      where: whereClause,
      include: { user: true },
      orderBy: { createdAt: "desc" },
      skip: skip,
      take: pageSize,
    }),
    
    db.ticket.count({ where: whereClause }),
 
    db.ticket.count({ where: userRole === "ADMIN" ? {} : { userId } }),

    db.ticket.count({ where: { status: "IN_PROGRESS", ...(userRole === "ADMIN" ? {} : { userId }) } }),
    db.ticket.count({ where: { status: "CLOSED", ...(userRole === "ADMIN" ? {} : { userId }) } }),
  ]);

  const totalPages = Math.ceil(filteredCount / pageSize);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 animate-in fade-in duration-700">
      
      {/* --- HEADER SECTION --- */}
      <div className="p-8 pb-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-zinc-900/40 p-8 rounded-[2rem] border border-zinc-800/50 backdrop-blur-md shadow-2xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">
                System Online 
              </span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
              Operations <span className="text-indigo-500">Hub</span>
            </h1>
            <p className="text-zinc-400 font-medium text-sm mt-1">
              Welcome back, <span className="text-zinc-200">{session?.user?.name}</span>
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <CreateTicketModal />
          </div>
        </div>
      </div>

    
      <div className="px-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardStat 
          title="Total Volume" 
          value={totalInSystem} 
          icon={<Ticket className="w-4 h-4" />} 
          color="indigo" 
          description="Global database"
        />
        <DashboardStat 
          title="In Progress" 
          value={inProgressCount} 
          icon={<Clock className="w-4 h-4" />} 
          color="emerald" 
          description="Active tickets"
        />
        <DashboardStat 
          title="Resolved" 
          value={resolvedCount} 
          icon={<CheckCircle className="w-4 h-4" />} 
          color="violet" 
          description="Archived cases"
        />
        <DashboardStat 
          title="Search Results" 
          value={filteredCount} 
          icon={<LayoutDashboard className="w-4 h-4" />} 
          color="rose" 
          description="Matching filters"
        />
      </div>

      {/* --- MAIN DATA TABLE --- */}
      <div className="p-8">
        <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-[2.5rem] overflow-hidden backdrop-blur-sm shadow-2xl">
          
          {/* Table Toolbar */}
          <div className="p-8 border-b border-zinc-800/50 flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                <Activity className="text-indigo-500 h-5 w-5" />
                <h3 className="font-black text-white uppercase tracking-tighter text-xl">Data Stream</h3>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/50 border border-zinc-700/50">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Real-time sync</span>
                </div>
            </div>

            {/* INTEGRATED FILTERS */}
            <SearchFilters />
          </div>
          
          {/* THE TABLE */}
          <div className="min-h-[400px]">
            <TicketTable tickets={tickets} userRole={userRole} />
          </div>

          {/* PAGINATION FOOTER */}
          <div className="p-6 border-t border-zinc-800/50 bg-zinc-900/20 flex items-center justify-between">
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              Showing Page {currentPage} of {totalPages || 1}{skip}-{skip + tickets.length}
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
      </div>
    </div>
  );
}

// STYLIZED STAT CARD COMPONENT
function DashboardStat({ title, value, icon, color, description }: any) {
  const colorMap: any = {
    indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    violet: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    rose: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  };

  return (
    <Card className="bg-zinc-900/40 border-zinc-800/50 hover:border-zinc-700 transition-all duration-300 group shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
          {title}
        </CardTitle>
        <div className={cn("p-2 rounded-xl border transition-transform group-hover:scale-110 duration-500", colorMap[color])}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-black text-white tracking-tighter mb-1">
          {value.toString().padStart(2, '0')}
        </div>
        <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}