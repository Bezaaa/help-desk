

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, ShieldCheck, Clock } from "lucide-react";
import { VerificationButton } from "@/components/dashboard/VerificationButton";
import { cn } from "@/lib/utils";

export default async function UsersPage() {
  const session = await auth();
  
  
  if (session?.user?.role !== "ADMIN") redirect("/dashboard");

  const users = await db.user.findMany({ 
    orderBy: { createdAt: "desc" } 
  });

  return (
    <div className="p-8 space-y-8 min-h-screen bg-zinc-950">
      <div className="flex justify-between items-center bg-zinc-900/40 p-8 rounded-[2rem] border border-zinc-800/50 backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            <Users className="text-indigo-500 h-8 w-8" />
            Identity <span className="text-indigo-500">Management</span>
          </h1>
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mt-1">
            Total System Operators: {users.length}
          </p>
        </div>
      </div>

      <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-[2.5rem] overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-900/80">
            <TableRow className="border-zinc-800">
              <TableHead className="text-zinc-500 font-black uppercase text-[10px] tracking-widest pl-8 py-5">Operator</TableHead>
              <TableHead className="text-zinc-500 font-black uppercase text-[10px] tracking-widest">Role</TableHead>
              <TableHead className="text-zinc-500 font-black uppercase text-[10px] tracking-widest">Status</TableHead>
              <TableHead className="text-zinc-500 font-black uppercase text-[10px] tracking-widest text-right pr-8">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="border-zinc-800/50 hover:bg-zinc-800/20">
                <TableCell className="pl-8 py-5">
                  <p className="font-bold text-zinc-200">{user.name}</p>
                  <p className="text-xs text-zinc-500">{user.email}</p>
                </TableCell>
                <TableCell>
                  <Badge className={cn(
                    "text-[9px] font-black uppercase tracking-widest",
                    user.role === "ADMIN" ? "bg-indigo-500" : "bg-zinc-800 text-zinc-400"
                  )}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.isVerified ? (
                    <span className="text-emerald-500 text-[10px] font-bold uppercase flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" /> Verified
                    </span>
                  ) : (
                    <span className="text-amber-500 text-[10px] font-bold uppercase flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Pending
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right pr-8">
                  {/* ONLY SHOW BUTTON IF NOT VERIFIED AND NOT THEMSELVES */}
                  {!user.isVerified && user.id !== session?.user?.id && (
                    <VerificationButton userId={user.id} />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}