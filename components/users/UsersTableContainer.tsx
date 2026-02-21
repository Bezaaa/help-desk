import { db } from "@/lib/db";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Clock } from "lucide-react";
import { VerificationButton } from "@/components/dashboard/VerificationButton";
import { cn } from "@/lib/utils";

export async function UsersTableContainer({ currentUserId }: { currentUserId?: string }) {
  // 1. DATA THINNING: We only select the 5 columns we actually display.
  // We EXCLUDE: password, verificationToken, resetToken, etc.
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isVerified: true,
    }
  });

  return (
    <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-[2.5rem] overflow-hidden">
      <Table>
        <TableHeader className="bg-zinc-900/80">
          <TableRow className="border-zinc-800">
            <TableHead className="text-zinc-500 font-black uppercase text-[10px] pl-8 py-5">Operator</TableHead>
            <TableHead className="text-zinc-500 font-black uppercase text-[10px]">Role</TableHead>
            <TableHead className="text-zinc-500 font-black uppercase text-[10px]">Status</TableHead>
            <TableHead className="text-zinc-500 font-black uppercase text-[10px] text-right pr-8">Action</TableHead>
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
                {!user.isVerified && user.id !== currentUserId && (
                  <VerificationButton userId={user.id} />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}