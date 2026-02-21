/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/db";
import { Ticket, Clock, CheckCircle, LayoutDashboard } from "lucide-react";
import { DashboardStat } from "./DashboardStat";

export async function StatsContainer({ userId, userRole, whereClause }: any) {
  // Fire all 4 count queries in parallel - One network round trip
  const [totalInSystem, inProgressCount, resolvedCount, filteredCount] = await Promise.all([
    db.ticket.count({ where: userRole === "ADMIN" ? {} : { userId } }),
    db.ticket.count({ where: { status: "IN_PROGRESS", ...(userRole === "ADMIN" ? {} : { userId }) } }),
    db.ticket.count({ where: { status: "CLOSED", ...(userRole === "ADMIN" ? {} : { userId }) } }),
    db.ticket.count({ where: whereClause }),
  ]);

  return (
    <div className="px-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <DashboardStat title="Total Volume" value={totalInSystem} icon={<Ticket className="w-4 h-4" />} color="indigo" description="Global database" />
      <DashboardStat title="In Progress" value={inProgressCount} icon={<Clock className="w-4 h-4" />} color="emerald" description="Active tickets" />
      <DashboardStat title="Resolved" value={resolvedCount} icon={<CheckCircle className="w-4 h-4" />} color="violet" description="Archived cases" />
      <DashboardStat title="Search Results" value={filteredCount} icon={<LayoutDashboard className="w-4 h-4" />} color="rose" description="Matching filters" />
    </div>
  );
}