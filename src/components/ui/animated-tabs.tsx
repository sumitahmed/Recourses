"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export interface TabProps {
  id: string
  label: string
  icon?: React.ReactNode
  content: React.ReactNode
}

export function AnimatedTabs({ tabs }: { tabs: TabProps[] }) {
  const [activeTab, setActiveTab] = useState(tabs[0].id)

  return (
    <div className="w-full flex flex-col mt-4">
      <div className="flex space-x-6 border-b border-border/40 w-full mb-8 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative flex items-center justify-center gap-2 pb-4 text-sm font-medium transition-colors outline-none whitespace-nowrap",
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="relative z-10 flex items-center gap-2">
                {tab.icon && <span className={cn("size-4", isActive ? "text-primary" : "")}>{tab.icon}</span>}
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="active-tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </div>

      <div className="w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {tabs.find(t => t.id === activeTab)?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
