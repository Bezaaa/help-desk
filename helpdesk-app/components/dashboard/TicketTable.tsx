/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useTransition } from "react";
import { updateTicketStatus } from "@/actions/ticketActions";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { TicketActionMenu } from "./TicketActionMenu";


interface TicketTableProps {
  tickets: any[];
  userRole: string | undefined;
}

export function TicketTable({ tickets, userRole }: TicketTableProps) {
  const [isPending, startTransition] = useTransition();

  const onStatusChange = (id: string, status: any) => {
    startTransition(async () => {
      const res = await updateTicketStatus(id, status);
      if (res.success) {
        toast.success("Status updated");
      } else {
        toast.error(res.error);
      }
    });
  };

  if (tickets.length === 0) {
    return (
      <div className="p-20 text-center text-zinc-500 font-mono text-sm uppercase tracking-widest bg-zinc-900/20 rounded-b-3xl">
        No records found in database.
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Loading Overlay for Status Updates */}
      {isPending && (
        <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-b-3xl">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="animate-spin text-indigo-500 h-8 w-8" />
            <p className="text-[10px] font-mono text-indigo-400 uppercase tracking-tighter">Updating DB...</p>
          </div>
        </div>
      )}

      <Table>
        <TableHeader className="bg-zinc-900/80 border-b border-zinc-800">
          <TableRow className="border-zinc-800 hover:bg-transparent">
            <TableHead className="text-zinc-500 font-black uppercase text-[10px] tracking-[0.2em] py-5 pl-6">Subject</TableHead>
            <TableHead className="text-zinc-500 font-black uppercase text-[10px] tracking-[0.2em]">Priority</TableHead>
            <TableHead className="text-zinc-500 font-black uppercase text-[10px] tracking-[0.2em]">Status</TableHead>
            {userRole === "ADMIN" && (
              <TableHead className="text-zinc-500 font-black uppercase text-[10px] tracking-[0.2em]">Operator</TableHead>
            )}
            <TableHead className="text-zinc-500 font-black uppercase text-[10px] tracking-[0.2em] text-right">Timestamp</TableHead>
            <TableHead className="w-[60px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id} className="border-zinc-800/50 hover:bg-zinc-800/20 transition-all group">
              {/* SUBJECT & DESCRIPTION */}
              <TableCell className="py-5 pl-6">
                <div className="flex flex-col">
                  <span className="font-bold text-zinc-200 text-sm tracking-tight group-hover:text-white transition-colors">
                    {ticket.title}
                  </span>
                  <span className="text-[11px] text-zinc-500 font-medium line-clamp-1 max-w-[300px]">
                    {ticket.description}
                  </span>
                </div>
              </TableCell>

              {/* PRIORITY */}
              <TableCell>
                <PriorityBadge priority={ticket.priority} />
              </TableCell>

              {/* STATUS (Dropdown for Admin, Badge for User) */}
              <TableCell>
                {userRole === "ADMIN" ? (
                  <Select
                    defaultValue={ticket.status}
                    onValueChange={(value) => onStatusChange(ticket.id, value)}
                    disabled={isPending}
                  >
                    <SelectTrigger className="w-[130px] h-8 bg-zinc-950 border-zinc-800 text-[10px] font-black uppercase tracking-wider focus:ring-indigo-500/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white shadow-2xl">
                      <SelectItem value="OPEN" className="text-[10px] font-bold uppercase tracking-widest focus:bg-indigo-600 focus:text-white">Open</SelectItem>
                      <SelectItem value="IN_PROGRESS" className="text-[10px] font-bold uppercase tracking-widest focus:bg-indigo-600 focus:text-white">In Progress</SelectItem>
                      <SelectItem value="CLOSED" className="text-[10px] font-bold uppercase tracking-widest focus:bg-indigo-600 focus:text-white">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <StatusBadge status={ticket.status} />
                )}
              </TableCell>

              {/* OPERATOR (Admin Only) */}
              {userRole === "ADMIN" && (
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-black text-indigo-400">
                      {ticket.user?.name?.charAt(0) || "U"}
                    </div>
                    <span className="text-xs text-zinc-400 font-medium">{ticket.user?.name || "System User"}</span>
                  </div>
                </TableCell>
              )}

              {/* TIMESTAMP */}
              <TableCell className="text-right text-zinc-600 font-mono text-[10px] tracking-tighter">
                {formatDistanceToNow(new Date(ticket.createdAt))} ago
              </TableCell>

              {/* CRUD ACTIONS (Edit/Delete) */}
              <TableCell className="text-right pr-6">
                <TicketActionMenu ticket={ticket} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// STYLIZED BADGES
function PriorityBadge({ priority }: { priority: string }) {
  const styles: any = {
    HIGH: "bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]",
    MEDIUM: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    LOW: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  };
  return (
    <Badge variant="outline" className={`${styles[priority]} font-black text-[9px] uppercase tracking-[0.1em] px-2 py-0.5 rounded-sm`}>
      {priority}
    </Badge>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    OPEN: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.1)]",
    IN_PROGRESS: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    CLOSED: "bg-zinc-800 text-zinc-500 border-zinc-700",
  };
  return (
    <Badge variant="outline" className={`${styles[status]} font-black text-[9px] uppercase tracking-[0.1em] px-2 py-0.5 rounded-sm`}>
      {status.replace("_", " ")}
    </Badge>
  );
}