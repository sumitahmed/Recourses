import { BookOpen, CheckSquare, Link as LinkIcon, MessageSquare } from "lucide-react"

export default function TopicLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 p-4 md:p-8 pb-32 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-24 bg-muted rounded-full"></div>
        </div>
        <div className="h-10 w-3/4 max-w-2xl bg-muted rounded-lg"></div>
        
        <div className="flex flex-wrap gap-4 mt-6 border-y border-border/50 py-4">
          <div className="h-6 w-32 bg-muted rounded-md"></div>
          <div className="h-6 w-24 bg-muted rounded-md"></div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="w-full">
        <div className="flex gap-2 border-b border-border/50 pb-2 mb-6 overflow-x-auto">
          {[
            { id: "overview", label: "Overview", icon: BookOpen },
            { id: "checklist", label: "Checklist", icon: CheckSquare },
            { id: "resources", label: "Resources", icon: LinkIcon },
            { id: "qa", label: "Q&A", icon: MessageSquare }
          ].map((tab) => (
            <div 
              key={tab.id}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-border/50 bg-muted/20 min-w-max"
            >
              <tab.icon className="h-4 w-4 text-muted" />
              <div className="h-4 w-16 bg-muted rounded-sm"></div>
            </div>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="space-y-6">
          <div className="h-8 w-48 bg-muted rounded-md mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 w-full bg-muted/50 rounded-md"></div>
            <div className="h-4 w-full bg-muted/50 rounded-md"></div>
            <div className="h-4 w-3/4 bg-muted/50 rounded-md"></div>
          </div>
          <div className="h-32 w-full bg-muted/20 rounded-xl mt-8"></div>
        </div>
      </div>
    </div>
  )
}
