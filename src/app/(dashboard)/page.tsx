import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckSquare, Flame, Map, BookOpen, Clock, Activity, ArrowRight, Target, LayoutDashboard } from "lucide-react"
import { db as prisma } from "@/lib/db"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { DashboardTaskList } from "@/components/dashboard/dashboard-task-list"

export default async function DashboardPage() {
  // Query DB for actual stats
  
  const topicsCompletedCount = await prisma.topic.count({
    where: { status: "Completed" }
  })
  
  const topicsInProgressCount = await prisma.topic.count({
    where: { status: "In Progress" }
  })

  const tasksPendingCount = await prisma.task.count({
    where: { status: "Pending" }
  })
  
  const tasksCompletedCount = await prisma.task.count({
    where: { status: "Completed" }
  })

  const recentTopics = await prisma.topic.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 4
  })

  const todaysTasks = await prisma.task.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10
  })

  return (
    <div className="mx-auto max-w-6xl space-y-10 p-2 md:p-6 pb-24">
      {/* Sleek Hero Greeting */}
      <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-background via-muted/30 to-muted/80 p-8 shadow-sm">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Welcome back.</h1>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Dive back into your modules or clear out your pending tasks to maintain momentum.
            </p>
          </div>
          <div className="hidden md:flex shrink-0">
             <div className="p-4 rounded-2xl bg-card border shadow-sm backdrop-blur-sm">
                <LayoutDashboard className="w-12 h-12 text-primary opacity-80" />
             </div>
          </div>
        </div>
      </div>

      {/* Dynamic Stats Grid - No Hardcoded Data */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="group overflow-hidden border-border/50 bg-card/40 backdrop-blur-sm hover:bg-card/60 transition-all hover:border-primary/30 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Mastered Topics</CardTitle>
            <div className="p-2 bg-green-500/10 rounded-full group-hover:scale-110 transition-transform">
                <BookOpen className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tighter">{topicsCompletedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Modules fully completed</p>
          </CardContent>
        </Card>
        
        <Card className="group overflow-hidden border-border/50 bg-card/40 backdrop-blur-sm hover:bg-card/60 transition-all hover:border-primary/30 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-full group-hover:scale-110 transition-transform">
                <Flame className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tighter">{topicsInProgressCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Active learning paths</p>
          </CardContent>
        </Card>
        
        <Card className="group overflow-hidden border-border/50 bg-card/40 backdrop-blur-sm hover:bg-card/60 transition-all hover:border-primary/30 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Tasks</CardTitle>
            <div className="p-2 bg-orange-500/10 rounded-full group-hover:scale-110 transition-transform">
                <Target className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tighter">{tasksPendingCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires your attention</p>
          </CardContent>
        </Card>

        <Card className="group overflow-hidden border-border/50 bg-card/40 backdrop-blur-sm hover:bg-card/60 transition-all hover:border-primary/30 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tasks Done</CardTitle>
            <div className="p-2 bg-purple-500/10 rounded-full group-hover:scale-110 transition-transform">
                <CheckSquare className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tighter">{tasksCompletedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Total items resolved</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Topics */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Resume Learning</CardTitle>
                <CardDescription>Recently accessed modules and topics.</CardDescription>
              </div>
              <Link href="/roadmaps" className="text-sm text-primary hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTopics.length > 0 ? (
                recentTopics.map((topic) => (
                  <Link href={`/t/${topic.slug}`} key={topic.id} className="group flex items-center gap-4 rounded-xl border border-border/40 p-4 hover:bg-muted/30 hover:border-primary/20 transition-all">
                    <div className="bg-primary/5 p-3 rounded-lg group-hover:bg-primary/10 transition-colors">
                        <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-semibold leading-none group-hover:text-primary transition-colors">{topic.title}</p>
                      <p className="text-xs text-muted-foreground">{topic.module}</p>
                    </div>
                    <Badge variant="outline" className="bg-background">
                       {topic.status}
                    </Badge>
                  </Link>
                ))
              ) : (
                <div className="text-sm text-muted-foreground p-8 text-center border rounded-xl border-dashed bg-muted/10">
                  <BookOpen className="w-8 h-8 mx-auto mb-3 opacity-20" />
                  No topics accessed yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Items */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Action Items</CardTitle>
            <CardDescription>Your pending tasks across all modules.</CardDescription>
          </CardHeader>
          <CardContent>
             <DashboardTaskList tasks={todaysTasks as any} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
