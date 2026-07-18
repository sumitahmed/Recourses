import { db as prisma } from "@/lib/db"
import { CheckSquare, Calendar, Flag, Plus, Circle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default async function TasksPage() {
  const tasks = await prisma.task.findMany({
    orderBy: [
      { status: 'asc' }, // Pending first
      { dueDate: 'asc' },
      { priority: 'desc' }
    ],
    include: {
      topic: true
    }
  })

  const pendingCount = tasks.filter(t => t.status === "Pending").length
  const completedCount = tasks.filter(t => t.status === "Completed").length

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground mt-1">
            You have {pendingCount} pending task{pendingCount !== 1 ? 's' : ''} and {completedCount} completed.
          </p>
        </div>
        <Button disabled>
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 border rounded-lg border-dashed bg-muted/10">
            <CheckSquare className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium">All caught up!</h3>
            <p className="text-muted-foreground mt-1 text-center max-w-sm">
              You have no tasks pending. Take a break or add a new task to your list.
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <div 
              key={task.id} 
              className={`flex items-start gap-4 p-4 rounded-lg border transition-all ${
                task.status === "Completed" ? "bg-muted/30 opacity-70" : "bg-card hover:border-indigo-500/50 hover:shadow-sm"
              }`}
            >
              <button disabled className="mt-1 flex-shrink-0 cursor-not-allowed">
                {task.status === "Completed" ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
              
              <div className="flex-1 space-y-2">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div>
                    <h3 className={`font-medium ${task.status === "Completed" ? "line-through text-muted-foreground" : ""}`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    {task.topic && (
                      <Badge variant="outline" className="bg-indigo-50/50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        {task.topic.title}
                      </Badge>
                    )}
                    {task.priority === "High" && (
                      <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400">
                        <Flag className="mr-1 h-3 w-3" /> High
                      </Badge>
                    )}
                    {task.priority === "Medium" && (
                      <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400">
                        Medium
                      </Badge>
                    )}
                  </div>
                </div>
                
                {task.dueDate && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
