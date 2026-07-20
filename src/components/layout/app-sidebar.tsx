"use client"

import * as React from "react"
import {
  BookOpen,
  BrainCircuit,
  CheckSquare,
  Code2,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  Library,
  Map,
  MessageSquare,
  Settings,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Roadmaps",
    url: "/roadmaps",
    icon: Map,
  },
  {
    title: "Checklists",
    url: "/checklists",
    icon: CheckSquare,
  },
  {
    title: "Knowledge Modules",
    url: "#",
    icon: Library,
    items: [
      { title: "DSA", url: "/module/dsa" },
      { title: "Core CS", url: "/module/core-cs" },
      { title: "Web Dev", url: "/module/web-dev" },
      { title: "System Design", url: "/module/system-design" },
      { title: "AI / ML", url: "/module/ai-ml" },
      { title: "DevOps", url: "/module/devops" },
    ],
  },
  {
    title: "Workspace",
    url: "#",
    icon: FolderKanban,
    items: [
      { title: "Projects", url: "/projects", icon: Code2 },
      { title: "Tasks", url: "/tasks", icon: CheckSquare },
      { title: "Placement Prep", url: "/placement", icon: GraduationCap },
      { title: "Aptitude Prep", url: "/aptitude", icon: BrainCircuit },
      { title: "Interviews", url: "/interviews", icon: MessageSquare },
      { title: "Resources", url: "/resources", icon: BookOpen },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <div className="flex h-12 items-center px-4">
          <div className="flex items-center gap-2 font-semibold tracking-tight">
            <div className="flex size-6 items-center justify-center rounded-sm bg-primary text-primary-foreground">
              <GraduationCap className="size-4" />
            </div>
            Recourse
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {/* Main Nav */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.slice(0, 3).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton render={<Link href={item.url} />} isActive={pathname === item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Knowledge Modules */}
        <SidebarGroup>
          <SidebarGroupLabel>Knowledge Modules</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.find(n => n.title === "Knowledge Modules")?.items?.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton render={<Link href={item.url} />} isActive={pathname === item.url}>
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Workspace */}
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.find(n => n.title === "Workspace")?.items?.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton render={<Link href={item.url} />} isActive={pathname === item.url}>
                    {'icon' in item && item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link href="/settings" />}>
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
