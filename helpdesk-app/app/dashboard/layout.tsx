import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopNav } from "@/components/dashboard/TopNav";
import { auth } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">
      <Sidebar userRole={session?.user?.role || "USER"} />
      
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        {/* TOP NAV GOES HERE */}
        <TopNav user={session?.user} />
        
        <main className="flex-1 overflow-y-auto p-0">
          {children}
        </main>
      </div>
    </div>
  );
}