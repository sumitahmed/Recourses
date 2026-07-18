"use client"

import { useState, useTransition } from "react"
import { CheckSquare, Trash2, Plus, Target, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addTask, toggleTaskStatus, deleteTask } from "@/app/(dashboard)/actions/task-actions"

interface Task {
  id: string
  title: string
  priority: string
  dueDate: Date | null
  createdAt: Date
  status: string
}

export function DashboardTaskList({ tasks }: { tasks: Task[] }) {
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [priority, setPriority] = useState("Medium")
  const [dueDate, setDueDate] = useState("")
  const [showOptions, setShowOptions] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return

    const title = newTaskTitle
    const p = priority
    const d = dueDate
    
    setNewTaskTitle("")
    setPriority("Medium")
    setDueDate("")
    setShowOptions(false)
    
    startTransition(async () => {
      await addTask(title, p, d)
    })
  }

  const handleToggle = (taskId: string, currentStatus: string) => {
    startTransition(async () => {
      await toggleTaskStatus(taskId, currentStatus)
    })
  }

  const handleDelete = (taskId: string) => {
    startTransition(async () => {
      await deleteTask(taskId)
    })
  }

  return (
    <div className="space-y-4">
      {/* Add Task Form */}
      <form onSubmit={handleAddTask} className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Input 
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onFocus={() => setShowOptions(true)}
            placeholder="Add a new task..."
            className="flex-1 bg-card/50"
            disabled={isPending}
          />
          <Button type="submit" size="icon" disabled={!newTaskTitle.trim() || isPending}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {showOptions && (
          <div className="flex gap-2 animate-in fade-in slide-in-from-top-2">
            <select 
              value={priority} 
              onChange={(e) => setPriority(e.target.value)}
              className="flex h-9 w-1/3 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isPending}
            >
              <option value="Low" className="bg-background text-foreground">Low Priority</option>
              <option value="Medium" className="bg-background text-foreground">Medium Priority</option>
              <option value="High" className="bg-background text-foreground">High Priority</option>
            </select>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="flex-1"
              disabled={isPending}
            />
          </div>
        )}
      </form>

      {/* Task List */}
      <div className="space-y-3 mt-4 max-h-[300px] overflow-y-auto pr-2">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div 
              key={task.id} 
              className={`group flex items-center gap-4 rounded-xl border border-border/40 p-3 bg-card/20 transition-all ${
                task.status === "Completed" ? "opacity-50" : ""
              }`}
            >
              <button 
                onClick={() => handleToggle(task.id, task.status)}
                className={`p-2 rounded-lg transition-colors ${
                  task.status === "Completed" 
                    ? "bg-primary/20 text-primary" 
                    : "bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary"
                }`}
                disabled={isPending}
              >
                <CheckSquare className="h-4 w-4" />
              </button>
              
              <div className="flex-1 space-y-1">
                <p className={`text-sm font-medium leading-none ${task.status === "Completed" ? "line-through" : ""}`}>
                  {task.title}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  {task.priority && (
                    <Badge variant={task.priority === 'High' ? 'destructive' : 'secondary'} className="text-[10px] px-1.5 py-0">{task.priority}</Badge>
                  )}
                  {task.dueDate && (
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 bg-muted/50 px-1.5 py-0.5 rounded">
                       <Calendar className="w-3 h-3" />
                       {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  <span className="text-[10px] text-muted-foreground opacity-50 ml-auto">
                     Created {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <button 
                onClick={() => handleDelete(task.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                disabled={isPending}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        ) : (
          <div className="text-sm text-muted-foreground p-8 text-center border rounded-xl border-dashed bg-muted/10">
             <Target className="w-8 h-8 mx-auto mb-3 opacity-20" />
            You're all caught up on tasks!
          </div>
        )}
      </div>
    </div>
  )
}
