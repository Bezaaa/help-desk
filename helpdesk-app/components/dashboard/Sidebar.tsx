"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, Settings, LogOut } from "lucide-react";
import { logout } from "@/actions/authActions";

export function Sidebar({ userRole }: { userRole: string }) {
  const pathname = usePathname();

  const links = [
    { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Users", icon: Users, href: "/dashboard/users", adminOnly: true },
    { label: "Settings", icon: Settings, href: "/dashboard/settings" },
  ];

  return (
    <div className="w-64 bg-black border-r border-zinc-800 h-screen fixed left-0 top-0 flex flex-col z-50">
      {/* 1. BRANDING - Fixed at top */}
      <div className="flex items-center gap-3 px-6 mb-8 mt-6">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-white">H</div>
        <span className="font-black text-xl tracking-tighter text-white uppercase">Helpdesk<span className="text-indigo-500">.</span></span>
      </div>

      {/* 2. NAVIGATION - Scrollable middle */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto scrollbar-hide">
        {links.map(link => {
          if (link.adminOnly && userRole !== "ADMIN") return null;
          const active = pathname === link.href;
          return (
            <Link key={link.href} href={link.href} className={cn(
              "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group",
              active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
            )}>
              <link.icon className={cn("w-5 h-5", active ? "text-white" : "text-zinc-500 group-hover:text-indigo-400")} />
              <span className="font-bold text-sm">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* 3. LOGOUT SECTION - Fixed at bottom */}
      <div className="p-4 border-t border-zinc-800 bg-black">
        <button 
          onClick={() => logout()}
          className="flex w-full items-center gap-3 px-3 py-3 text-zinc-500 hover:text-rose-400 transition-all duration-200 rounded-xl hover:bg-rose-500/10 group"
        >
          <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          <span className="text-sm font-bold tracking-tight uppercase">Terminate Session</span>
        </button>
      </div>
    </div>
  );
}