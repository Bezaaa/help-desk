import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "indigo" | "emerald" | "violet" | "rose";
  description: string;
}

export function DashboardStat({ title, value, icon, color, description }: StatProps) {
  const colorMap = {
    indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    violet: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    rose: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  };

  return (
    <Card className="bg-zinc-900/40 border-zinc-800/50 hover:border-zinc-700 transition-all duration-300 group shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{title}</CardTitle>
        <div className={cn("p-2 rounded-xl border transition-transform group-hover:scale-110 duration-500", colorMap[color])}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-black text-white tracking-tighter mb-1">
          {value.toString().padStart(2, '0')}
        </div>
        <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest">{description}</p>
      </CardContent>
    </Card>
  );
}