/* eslint-disable @typescript-eslint/no-explicit-any */
export const revalidate = 0;
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store"; 
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { CreateTicketModal } from "@/components/dashboard/CreateTicketModal";
import { StatsContainer } from "@/components/dashboard/StatsContainer";
import { TicketsTableContainer } from "@/components/dashboard/TicketsTableContainer";
import { StatsSkeleton } from "@/components/dashboard/Skeletons";

export default async function DashboardPage({ searchParams }: any) {
  const resolvedParams = await searchParams;
  const session = await auth();
  
 
  const whereClause = {
    ...(session?.user?.role === "ADMIN" ? {} : { userId: session?.user?.id }),
    ...(resolvedParams.priority && resolvedParams.priority !== "ALL" ? { priority: resolvedParams.priority } : {}),
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="p-8 pb-4">
         {/* HEADER RENDERS INSTANTLY */}
         <div className="flex justify-between items-center bg-zinc-900/40 p-8 rounded-[2rem] border border-zinc-800/50">
            <h1>Operations Hub</h1>
            <CreateTicketModal />
         </div>
      </div>

      {/* STREAMING SLOT 1: STATS */}
      <Suspense fallback={<StatsSkeleton />}>
        <StatsContainer 
          userId={session?.user?.id} 
          userRole={session?.user?.role} 
          whereClause={whereClause} 
        />
      </Suspense>

      {/* STREAMING SLOT 2: TABLE */}
      <div className="p-8">
        <Suspense fallback={<div className="h-96 bg-zinc-900/20 animate-pulse rounded-[2.5rem]" />}>
          <TicketsTableContainer searchParams={resolvedParams} />
        </Suspense>
      </div>
    </div>
  );
}