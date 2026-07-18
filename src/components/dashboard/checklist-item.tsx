"use client"

import { useTransition } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { toggleChecklistItem } from "@/app/(dashboard)/checklists/actions"

interface ChecklistItemProps {
  id: string
  content: string
  isCompleted: boolean
}

export function GlobalChecklistItem({ item }: { item: ChecklistItemProps }) {
  const [isPending, startTransition] = useTransition()

  const handleToggle = () => {
    startTransition(async () => {
      await toggleChecklistItem(item.id, item.isCompleted)
    })
  }

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${item.isCompleted ? 'bg-primary/5 border-primary/20' : 'bg-card border-border/40 hover:border-border'}`}>
      <Checkbox 
        id={item.id} 
        checked={item.isCompleted} 
        onCheckedChange={handleToggle}
        disabled={isPending}
        className="mt-0.5"
      />
      <label 
        htmlFor={item.id} 
        className={`text-sm leading-tight cursor-pointer ${item.isCompleted ? 'text-muted-foreground line-through opacity-70' : 'font-medium'}`}
      >
        {item.content}
      </label>
    </div>
  )
}
