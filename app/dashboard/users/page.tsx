import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Users } from "lucide-react";

import { TableSkeleton } from "@/components/dashboard/Skeletons";
import { UsersTableContainer } from "@/components/users/UsersTableContainer";

export default async function UsersPage() {
  
  const sessionPromise = auth();

  const session = await sessionPromise;
  
  if (session?.user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="p-8 space-y-8 min-h-screen bg-zinc-950">
      {/* HEADER SECTION - Renders instantly */}
      <div className="flex justify-between items-center bg-zinc-900/40 p-8 rounded-[2rem] border border-zinc-800/50 backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            <Users className="text-indigo-500 h-8 w-8" />
            Identity <span className="text-indigo-500">Management</span>
          </h1>
        </div>
      </div>

      {/* STREAMING TABLE - Shows skeleton during Neon Cold Start */}
      <Suspense fallback={<TableSkeleton />}>
        <UsersTableContainer currentUserId={session?.user?.id} />
      </Suspense>
    </div>
  );
}