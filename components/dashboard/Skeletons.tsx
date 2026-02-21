import { Card, CardContent, CardHeader } from "@/components/ui/card";


const SkeletonPulse = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-zinc-800/50 rounded-lg ${className}`} />
);


export function StatsSkeleton() {
  return (
    <div className="px-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="bg-zinc-900/40 border-zinc-800/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <SkeletonPulse className="h-3 w-20" />
            <SkeletonPulse className="h-8 w-8 rounded-xl" />
          </CardHeader>
          <CardContent>
            <SkeletonPulse className="h-10 w-16 mb-2" />
            <SkeletonPulse className="h-3 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// 2. Ticket Table Skeleton
export function TableSkeleton() {
  return (
    <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-[2.5rem] overflow-hidden">
      {/* Fake Header */}
      <div className="p-8 border-b border-zinc-800/50 flex justify-between">
        <SkeletonPulse className="h-6 w-32" />
        <SkeletonPulse className="h-6 w-64" />
      </div>
      
      {/* Fake Rows */}
      <div className="p-8 space-y-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between border-b border-zinc-800/30 pb-6 last:border-0">
            <div className="space-y-2">
              <SkeletonPulse className="h-4 w-48" />
              <SkeletonPulse className="h-3 w-32" />
            </div>
            <div className="flex gap-4">
              <SkeletonPulse className="h-6 w-16" />
              <SkeletonPulse className="h-6 w-16" />
              <SkeletonPulse className="h-6 w-16" />
            </div>
          </div>
        ))}
      </div>

      {/* Fake Footer */}
      <div className="p-6 border-t border-zinc-800/50 bg-zinc-900/20 flex justify-between">
        <SkeletonPulse className="h-4 w-40" />
        <div className="flex gap-2">
          <SkeletonPulse className="h-10 w-20 rounded-xl" />
          <SkeletonPulse className="h-10 w-20 rounded-xl" />
        </div>
      </div>
    </div>
  );
}