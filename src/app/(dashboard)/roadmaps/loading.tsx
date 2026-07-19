import { Map, LayoutGrid } from "lucide-react"

export default function RoadmapsLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 animate-pulse">
      <div>
        <div className="h-9 w-64 bg-muted rounded-md mb-2"></div>
        <div className="h-5 w-96 bg-muted/50 rounded-md"></div>
      </div>

      <div className="grid gap-8">
        {[1, 2, 3].map((module) => (
          <div key={module} className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <Map className="h-5 w-5 text-muted" />
              <div className="h-7 w-48 bg-muted rounded-md"></div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((card) => (
                <div key={card} className="h-32 rounded-xl border bg-card/20 p-6 flex flex-col justify-between">
                  <div>
                    <div className="h-5 w-3/4 bg-muted rounded-md mb-2"></div>
                    <div className="h-4 w-full bg-muted/50 rounded-md"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-24 bg-muted/30 rounded-md"></div>
                    <div className="h-4 w-4 bg-muted/30 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
