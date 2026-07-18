import { db as prisma } from "@/lib/db"
import { GlobalChecklistItem } from "@/components/dashboard/checklist-item"
import { Progress } from "@/components/ui/progress"
import { ListTodo, CheckCircle2 } from "lucide-react"

export default async function ChecklistsPage() {
  const topicsWithChecklists = await prisma.topic.findMany({
    where: {
      checklists: {
        some: {}
      }
    },
    include: {
      checklists: {
        include: {
          items: true
        }
      }
    },
    orderBy: {
      title: 'asc'
    }
  });

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-4 md:p-8 pb-24">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <ListTodo className="w-8 h-8 text-primary" />
          Master Checklists
        </h1>
        <p className="text-muted-foreground">
          Track your preparation across all domains. These checklists cover core CS fundamentals, system design, DSA, and AI/ML.
        </p>
      </div>

      <div className="space-y-12">
        {topicsWithChecklists.map((topic) => {
          // Calculate overall progress for the topic
          const totalItems = topic.checklists.reduce((acc, cl) => acc + cl.items.length, 0);
          const completedItems = topic.checklists.reduce((acc, cl) => acc + cl.items.filter(i => i.isCompleted).length, 0);
          const progress = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

          return (
            <div key={topic.id} className="space-y-6 bg-card/30 border border-border/50 rounded-2xl p-6 shadow-sm">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-4">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">{topic.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">Module: {topic.module}</p>
                </div>
                
                <div className="flex items-center gap-4 min-w-[200px]">
                  <div className="flex-1 space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span>{completedItems} / {totalItems} completed</span>
                      <span className={progress === 100 ? "text-green-500" : ""}>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  {progress === 100 && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {topic.checklists.map((checklist) => (
                  <div key={checklist.id} className="space-y-3">
                    <h3 className="font-medium text-primary flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {checklist.title}
                    </h3>
                    <div className="space-y-2 pl-3 border-l-2 border-primary/10">
                      {checklist.items.map((item) => (
                        <GlobalChecklistItem key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
