import { db } from "@/lib/db"
import Link from "next/link"
import { Prisma } from "@prisma/client"
import { BookOpen, CheckCircle2, ChevronRight, Layers, LayoutGrid, FileText, Activity } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Map slugs to actual DB modules/categories
const slugToModules: Record<string, string[]> = {
  "core-cs": ["Core CS"],
  "dsa": ["DSA"],
  "system-design": ["System Design"],
  "web-dev": ["Web Dev", "Backend", "Frontend"],
  "backend": ["Web Dev", "Backend"], // For backward compatibility with bookmarked links
  "frontend": ["Web Dev", "Frontend"],
  "ai-ml": ["AI / ML", "AI/ML", "AI"],
  "devops": ["DevOps"],
}

type TopicWithProgress = {
  id: string
  title: string
  slug: string
  module: string
  description: string | null
  status: string
  parentId: string | null
  totalItems: number
  completedItems: number
  subTopics: TopicWithProgress[]
}

type RawTopicWithProgress = Omit<TopicWithProgress, "subTopics" | "totalItems" | "completedItems"> & {
  totalItems: bigint
  completedItems: bigint
}

function TopicGrid({ topics }: { topics: TopicWithProgress[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {topics.map((topic) => {
        const totalItems = topic.totalItems
        const completedItems = topic.completedItems
        const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
        const isMastered = progress === 100 && totalItems > 0

        let href = `/t/${topic.slug}`
        
        // Override routes for specific offline courses
        if (topic.title.toLowerCase().includes("dbms")) {
          href = "/resources/dbms"
        } else if (topic.title.toLowerCase().includes("oop")) {
          href = "/resources/oops"
        }

        return (
          <Link href={href} key={topic.id} className="group block h-full">
            <div className={`flex flex-col h-full p-5 rounded-2xl border transition-all duration-300 shadow-sm
              ${isMastered 
                ? 'bg-green-500/5 border-green-500/20 hover:border-green-500/40 hover:bg-green-500/10' 
                : 'bg-card/40 backdrop-blur-sm border-border/50 hover:border-primary/40 hover:bg-muted/30 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${isMastered ? 'bg-green-500/20 text-green-500' : 'bg-primary/10 text-primary group-hover:scale-110 transition-transform'}`}>
                  {isMastered ? <CheckCircle2 className="size-5" /> : <BookOpen className="size-5" />}
                </div>
                <ChevronRight className="size-4 text-muted-foreground opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>

              <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-primary transition-colors leading-tight">
                {topic.title}
              </h3>
              
              {topic.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 mb-4 flex-1">
                  {topic.description}
                </p>
              )}
              
              <div className="mt-auto pt-4 border-t border-border/40">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-semibold mb-2">
                  <span className="text-muted-foreground">{completedItems} / {totalItems} tasks</span>
                  <span className={isMastered ? "text-green-500" : "text-primary"}>{progress}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-secondary/50 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ease-in-out ${isMastered ? 'bg-green-500' : 'bg-primary'}`}
                    style={{ width: `${progress}%` }} 
                  />
                </div>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let targetModules = slugToModules[slug]

  if (!targetModules) {
    const titleCase = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    targetModules = [titleCase]
  }

  // A single database round trip: Postgres does the joins and aggregation.
  const rawRows = await db.$queryRaw<RawTopicWithProgress[]>(Prisma.sql`
    SELECT
      t.id,
      t.title,
      t.slug,
      t.module,
      t.description,
      t.status,
      t."parentId",
      COUNT(i.id) AS "totalItems",
      COUNT(i.id) FILTER (WHERE i."isCompleted") AS "completedItems"
    FROM "Topic" AS t
    LEFT JOIN "Checklist" AS c ON c."topicId" = t.id
    LEFT JOIN "ChecklistItem" AS i ON i."checklistId" = c.id
    WHERE t.module IN (${Prisma.join(targetModules)})
    GROUP BY t.id
    ORDER BY t.title ASC
  `)

  // COUNT() returns BigInt from Postgres. Convert before these values enter the
  // React Server Component tree; BigInt cannot be serialized by Next.js.
  const allTopics: TopicWithProgress[] = rawRows.map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    module: row.module,
    description: row.description,
    status: row.status,
    parentId: row.parentId,
    totalItems: Number(row.totalItems),
    completedItems: Number(row.completedItems),
    subTopics: [],
  }))

  const topicsById = new Map(allTopics.map((topic) => [topic.id, topic]))
  const parentTopics = allTopics.filter((topic) => topic.parentId === null)

  for (const topic of allTopics) {
    if (topic.parentId) {
      topicsById.get(topic.parentId)?.subTopics.push(topic)
    }
  }

  const topics = parentTopics

  const moduleName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

  const sectionedTopics = topics.filter(t => t.subTopics.length > 0)
  const flatTopics = topics.filter(t => t.subTopics.length === 0)

  // Separate Preparation Sheets from General Topics
  const prepSheets = sectionedTopics.filter(t => t.title.toLowerCase().includes('sheet') || t.title.toLowerCase().includes('neetcode'))
  const generalSectioned = sectionedTopics.filter(t => !(t.title.toLowerCase().includes('sheet') || t.title.toLowerCase().includes('neetcode')))

  return (
    <div className="mx-auto max-w-6xl space-y-12 p-4 md:p-8 pb-32">
      {/* Premium Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-background via-muted/30 to-muted/80 p-8 shadow-sm">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
        
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary border-transparent">
            <Activity className="w-3 h-3 mr-1" /> Module Overview
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">{moduleName}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Master the fundamentals, tackle curated interview sheets, and track your progress in real-time.
          </p>
        </div>
      </div>

      {parentTopics.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed p-16 text-center bg-muted/10">
          <Layers className="size-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-semibold">No topics found</h3>
          <p className="text-muted-foreground mt-2">Content for this module will be automatically generated soon.</p>
        </div>
      ) : (
        <div className="space-y-16">
          

          
          {/* Preparation Sheets Section */}
          {prepSheets.length > 0 && (
            <div className="space-y-8">
              <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                <LayoutGrid className="size-8 text-primary" />
                <div>
                  <h2 className="text-3xl font-extrabold tracking-tight">Curated Sheets</h2>
                  <p className="text-muted-foreground text-sm mt-1">Structured problem-solving tracks (Striver, NeetCode, etc.)</p>
                </div>
              </div>

              <div className="space-y-4">
                {prepSheets.map(parentTopic => (
                  <details key={parentTopic.id} className="group border border-border/50 rounded-2xl bg-card/20 overflow-hidden shadow-sm">
                    <summary className="flex items-center justify-between p-6 cursor-pointer list-none select-none hover:bg-muted/30 transition-colors [&::-webkit-details-marker]:hidden">
                      <div className="flex items-center gap-4">
                        <ChevronRight className="size-5 text-muted-foreground transition-transform duration-300 group-open:rotate-90" />
                        <h3 className="text-2xl font-bold tracking-tight text-foreground">{parentTopic.title}</h3>
                      </div>
                      <Badge variant="secondary">{parentTopic.subTopics.length} Chapters</Badge>
                    </summary>
                    <div className="p-6 pt-0 border-t border-border/50 bg-background/50">
                      <TopicGrid topics={parentTopic.subTopics} />
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* General Core Topics Section */}
          {(generalSectioned.length > 0 || flatTopics.length > 0) && (
            <div className="space-y-8">
              <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                <FileText className="size-8 text-primary" />
                <div>
                  <h2 className="text-3xl font-extrabold tracking-tight">Core Concepts & Interview Prep</h2>
                  <p className="text-muted-foreground text-sm mt-1">Theory, definitions, algorithms, and general interview questions.</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Topics that have subtopics (like nested chapters) */}
                {generalSectioned.map(parentTopic => (
                  <details key={parentTopic.id} className="group border border-border/50 rounded-2xl bg-card/20 overflow-hidden shadow-sm">
                    <summary className="flex items-center justify-between p-6 cursor-pointer list-none select-none hover:bg-muted/30 transition-colors [&::-webkit-details-marker]:hidden">
                      <div className="flex items-center gap-4">
                        <ChevronRight className="size-5 text-muted-foreground transition-transform duration-300 group-open:rotate-90" />
                        <h3 className="text-2xl font-bold tracking-tight text-foreground">{parentTopic.title}</h3>
                      </div>
                      <Badge variant="secondary">{parentTopic.subTopics.length} Sections</Badge>
                    </summary>
                    <div className="p-6 pt-0 border-t border-border/50 bg-background/50">
                      <TopicGrid topics={parentTopic.subTopics} />
                    </div>
                  </details>
                ))}

                {/* Topics that are just flat (no subtopics) */}
                {flatTopics.length > 0 && (
                  <details className="group border border-border/50 rounded-2xl bg-card/20 overflow-hidden shadow-sm">
                    <summary className="flex items-center justify-between p-6 cursor-pointer list-none select-none hover:bg-muted/30 transition-colors [&::-webkit-details-marker]:hidden">
                      <div className="flex items-center gap-4">
                        <ChevronRight className="size-5 text-muted-foreground transition-transform duration-300 group-open:rotate-90" />
                        <h3 className="text-2xl font-bold tracking-tight text-foreground">General Topics</h3>
                      </div>
                      <Badge variant="secondary">{flatTopics.length} Topics</Badge>
                    </summary>
                    <div className="p-6 pt-0 border-t border-border/50 bg-background/50">
                      <TopicGrid topics={flatTopics} />
                    </div>
                  </details>
                )}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  )
}
