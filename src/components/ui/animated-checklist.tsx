"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

import { toggleChecklistItem } from "@/app/(dashboard)/checklists/actions"

export interface ChecklistItem {
  id: string
  content: string
  isCompleted: boolean
}

export interface ChecklistGroup {
  id: string
  title: string
  items: ChecklistItem[]
}

export function AnimatedChecklist({ checklists }: { checklists: ChecklistGroup[] }) {
  // Local state for instant UI response, syncs to DB
  const [itemsState, setItemsState] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {}
    checklists.forEach(list => {
      list.items.forEach(item => {
        initialState[item.id] = item.isCompleted
      })
    })
    return initialState
  })

  const toggleItem = async (id: string) => {
    const currentStatus = itemsState[id]
    setItemsState(prev => ({ ...prev, [id]: !currentStatus }))
    await toggleChecklistItem(id)
  }

  return (
    <div className="space-y-8">
      {checklists.map((list) => {
        const completedCount = list.items.filter(i => itemsState[i.id]).length
        const progress = Math.round((completedCount / list.items.length) * 100) || 0

        return (
          <div key={list.id} className="space-y-4 rounded-xl border border-border/40 bg-card/30 p-6 backdrop-blur-md shadow-sm">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold tracking-tight">{list.title}</h4>
              <span className="text-sm font-medium text-muted-foreground">{progress}% Complete</span>
            </div>
            
            {/* Minimal Progress bar */}
            <div className="h-1 w-full overflow-hidden rounded-full bg-secondary/50">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "circOut" }}
              />
            </div>

            <div className="mt-4 space-y-3 pt-2">
              <AnimatePresence>
                {list.items.map((item, index) => {
                  const isChecked = itemsState[item.id]
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group flex cursor-pointer items-start gap-3 rounded-lg border border-transparent p-2 transition-colors hover:bg-muted/50"
                      onClick={() => toggleItem(item.id)}
                    >
                      <div className={cn(
                        "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-all duration-300",
                        isChecked 
                          ? "bg-primary border-primary text-primary-foreground" 
                          : "border-muted-foreground/30 bg-background group-hover:border-primary/50"
                      )}>
                        <motion.div
                          initial={false}
                          animate={{ scale: isChecked ? 1 : 0, opacity: isChecked ? 1 : 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        >
                          <Check className="size-3.5 stroke-[3]" />
                        </motion.div>
                      </div>
                      
                      <span className={cn(
                        "text-sm leading-relaxed transition-all duration-300",
                        isChecked ? "text-muted-foreground line-through decoration-muted-foreground/30" : "text-foreground"
                      )}>
                        {item.content}
                      </span>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>
        )
      })}
    </div>
  )
}
