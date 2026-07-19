import { db as prisma } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Map, ChevronRight, BookOpen } from "lucide-react"
import Link from "next/link"

export default async function RoadmapsPage() {
  // Fetch all parent topics
  const topics = await prisma.topic.findMany({
    where: { parentId: null },
    include: {
      _count: {
        select: { subTopics: true }
      }
    },
    orderBy: { title: 'asc' }
  })

  // Group by module
  const grouped = topics.reduce((acc, topic) => {
    if (!acc[topic.module]) acc[topic.module] = []
    acc[topic.module].push(topic)
    return acc
  }, {} as Record<string, typeof topics>)

  const moduleOrder = ["DSA", "System Design", "Core CS", "Web Dev", "AI / ML", "DevOps"]
  const sortedModules = Object.keys(grouped).sort((a, b) => {
    const idxA = moduleOrder.indexOf(a)
    const idxB = moduleOrder.indexOf(b)
    if (idxA !== -1 && idxB !== -1) return idxA - idxB
    if (idxA !== -1) return -1
    if (idxB !== -1) return 1
    return a.localeCompare(b)
  })

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Learning Roadmaps</h1>
        <p className="text-muted-foreground mt-1">Structured paths to master your tech stack and ace interviews.</p>
      </div>

      <div className="grid gap-8">
        {sortedModules.map((module) => (
          <div key={module} className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <Map className="h-5 w-5 text-indigo-500" />
              <h2 className="text-2xl font-semibold tracking-tight">{module} Roadmap</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {grouped[module].map((topic) => (
                <Link key={topic.id} href={`/t/${topic.slug}`}>
                  <Card className="h-full hover:shadow-md hover:border-indigo-500/50 transition-all cursor-pointer group">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg group-hover:text-indigo-600 transition-colors">
                        {topic.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {topic.description || "Explore this topic in depth."}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{topic._count.subTopics} subtopics</span>
                        </div>
                        <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
