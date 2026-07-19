import { Activity, Layers } from "lucide-react"

export default function ModuleLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-12 p-4 md:p-8 pb-32 animate-pulse">
      {/* Premium Hero Header Skeleton */}
      <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-background via-muted/30 to-muted/80 p-8 shadow-sm">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />
        
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary/5 text-primary/50 border-transparent">
            <Activity className="w-3 h-3 mr-1" /> Module Overview
          </div>
          <div className="h-12 w-64 bg-muted rounded-lg"></div>
          <div className="h-6 w-full max-w-2xl bg-muted/50 rounded-lg mt-2"></div>
          <div className="h-6 w-3/4 max-w-xl bg-muted/50 rounded-lg"></div>
        </div>
      </div>

      <div className="space-y-16">
        <div className="space-y-8">
          <div className="flex items-center gap-3 border-b border-border/50 pb-4">
            <Layers className="size-6 text-muted" />
            <div className="h-8 w-48 bg-muted rounded-lg"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="h-[200px] rounded-2xl border bg-card/20 p-5 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 bg-muted rounded-lg"></div>
                  <div className="h-4 w-4 bg-muted rounded-full"></div>
                </div>
                <div className="h-6 w-3/4 bg-muted rounded-md mb-2"></div>
                <div className="h-4 w-full bg-muted/50 rounded-md mb-1"></div>
                <div className="h-4 w-2/3 bg-muted/50 rounded-md mb-4"></div>
                
                <div className="mt-auto pt-4 border-t border-border/40">
                  <div className="flex justify-between mb-2">
                    <div className="h-3 w-16 bg-muted rounded-md"></div>
                    <div className="h-3 w-8 bg-muted rounded-md"></div>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
