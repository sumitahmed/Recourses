import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { AnimatedTabs, TabProps } from "@/components/ui/animated-tabs"
import { AnimatedChecklist } from "@/components/ui/animated-checklist"
import { 
  BookOpen, 
  CheckSquare, 
  Pencil, 
  Link as LinkIcon, 
  MessageSquare, 
  Calendar,
  CheckCircle2
} from "lucide-react"

export const revalidate = 60; // Cache for 60 seconds

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const topic = await db.topic.findUnique({
    where: { slug },
    include: {
      checklists: {
        include: {
          items: true,
        },
      },
      interviewQuestions: true,
      resources: true,
    },
  })
  
  if (!topic) return notFound()

  // Calculate overall progress for header
  const totalItems = topic.checklists.reduce((acc, cl) => acc + cl.items.length, 0)
  const completedItems = topic.checklists.reduce((acc, cl) => acc + cl.items.filter(i => i.isCompleted).length, 0)
  const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
  const isCompleted = progress === 100 && totalItems > 0

  // Define tabs with Lucide icons (No more Emojis!)
  const tabs: TabProps[] = [
    {
      id: "overview",
      label: "Overview",
      icon: <BookOpen />,
      content: (
        <div className="py-6 space-y-6">
          <div className="prose prose-invert max-w-none">
            <h3 className="text-xl font-semibold mb-4">Topic Overview</h3>
            <p className="text-muted-foreground leading-relaxed">
              The Rich Text Editor (TipTap) will be mounted here in the next phase. 
              Once your Notion links and content are provided, they will seamlessly integrate here.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "checklist",
      label: "Checklist",
      icon: <CheckSquare />,
      content: (
        <div className="py-6">
          {topic.checklists.length > 0 ? (
            <AnimatedChecklist checklists={topic.checklists} />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/50 py-16 text-center bg-muted/5">
              <div className="p-4 bg-muted/30 rounded-full mb-4">
                <CheckSquare className="size-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No checklist items</h3>
              <p className="text-muted-foreground text-sm mt-1">You have no tasks mapped to this topic yet.</p>
            </div>
          )}
        </div>
      )
    },
    {
      id: "resources",
      label: "Resources",
      icon: <LinkIcon />,
      content: (
        <div className="py-6 space-y-6">
          {topic.resources && topic.resources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topic.resources.map((resource) => (
                <a 
                  key={resource.id} 
                  href={resource.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="group flex flex-col p-5 rounded-2xl border border-border/50 bg-card/40 hover:bg-muted/30 hover:border-primary/40 transition-all shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                      {resource.type}
                    </Badge>
                    <LinkIcon className="size-4 text-muted-foreground opacity-50 group-hover:opacity-100 group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 truncate">
                    {resource.url}
                  </p>
                </a>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/50 py-16 text-center bg-muted/5">
              <div className="p-4 bg-muted/30 rounded-full mb-4">
                <LinkIcon className="size-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No external resources</h3>
              <p className="text-muted-foreground text-sm mt-1">Add URLs, PDFs, or Notion links to track them here.</p>
            </div>
          )}
        </div>
      )
    },
    {
      id: "notes",
      label: "My Notes",
      icon: <Pencil />,
      content: (
        <div className="py-6 space-y-6">
          <div className="prose prose-invert max-w-none">
            <h3 className="text-xl font-semibold mb-4">Personal Notes</h3>
            <p className="text-muted-foreground leading-relaxed">
              Your private markdown notes will appear here.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "interview",
      label: "Interview Qs",
      icon: <MessageSquare />,
      content: (
        <div className="py-6 space-y-6">
          {topic.interviewQuestions.length > 0 ? (
            topic.interviewQuestions.map((q, idx) => (
              <div key={q.id} className="rounded-2xl border border-border/40 bg-card/30 p-6 shadow-sm hover:border-primary/30 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">
                    <span className="text-primary mr-2">Q{idx + 1}.</span> 
                    {q.question}
                  </h3>
                  <Badge variant="secondary" className="ml-4 shrink-0">{q.difficulty}</Badge>
                </div>
                <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap mt-2 p-5 bg-muted/20 rounded-xl border border-border/30">
                  <span className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-green-500" /> Ideal Answer
                  </span>
                  {q.idealAnswer || 'To be discussed.'}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/50 py-16 text-center bg-muted/5">
              <div className="p-4 bg-muted/30 rounded-full mb-4">
                <MessageSquare className="size-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No interview questions</h3>
              <p className="text-muted-foreground text-sm mt-1">Crawlers haven't populated questions for this topic yet.</p>
            </div>
          )}
        </div>
      )
    },
    {
      id: "tasks",
      label: "Tasks",
      icon: <Calendar />,
      content: (
        <div className="py-6 space-y-6">
          <div className="prose prose-invert max-w-none">
            <h3 className="text-xl font-semibold mb-4">Action Items</h3>
            <p className="text-muted-foreground leading-relaxed">
              Scheduled revisions or project tasks will appear here.
            </p>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-4 md:p-8 pb-32">
      {/* Clean, Notion-style Header without heavy boxy borders */}
      <div className="flex flex-col gap-6 pt-8 pb-4 border-b border-border/30">
        
        {/* Breadcrumb / Status Row */}
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 transition-colors">
            {topic.module}
          </Badge>
          <span className="text-muted-foreground/50 text-sm">•</span>
          <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
            {isCompleted ? (
              <span className="flex items-center gap-1.5 text-green-500 bg-green-500/10 px-2 py-0.5 rounded-md">
                <CheckCircle2 className="size-3.5" /> Mastered
              </span>
            ) : (
              <span className="bg-muted px-2 py-0.5 rounded-md text-muted-foreground">In Progress</span>
            )}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          {topic.title}
        </h1>

        {/* Description */}
        {topic.description && (
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            {topic.description}
          </p>
        )}

        {/* Progress Display - Much sleeker now */}
        {totalItems > 0 && (
          <div className="flex items-center gap-4 mt-2">
            <span className="text-sm font-semibold tracking-wider uppercase text-muted-foreground">Mastery</span>
            <div className="flex-1 max-w-xs h-1.5 bg-secondary rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ease-out ${isCompleted ? 'bg-green-500' : 'bg-primary'}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className={`text-sm font-bold ${isCompleted ? 'text-green-500' : 'text-primary'}`}>
              {progress}%
            </span>
          </div>
        )}
      </div>

      {/* Animated Tabs Area */}
      <AnimatedTabs tabs={tabs} />
    </div>
  )
}
