import { db as prisma } from "@/lib/db"
import { ExternalLink, PlaySquare, FileText, BookOpen, Code } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { safeExternalUrl } from "@/lib/safe-url"

export default async function ResourcesPage() {
  const resources = await prisma.resource.findMany({
    include: {
      topic: true
    },
    orderBy: { title: 'asc' }
  })

  const safeResources = resources.flatMap((resource) => {
    const url = safeExternalUrl(resource.url)
    return url ? [{ ...resource, url }] : []
  })

  // Group only validated external URLs by type.
  const grouped = safeResources.reduce((acc, resource) => {
    if (!acc[resource.type]) acc[resource.type] = []
    acc[resource.type].push(resource)
    return acc
  }, {} as Record<string, typeof safeResources>)

  const getTypeIcon = (type: string) => {
    switch(type) {
      case "Video": return <PlaySquare className="h-4 w-4 text-rose-500" />
      case "Article": return <FileText className="h-4 w-4 text-blue-500" />
      case "Official Docs": return <BookOpen className="h-4 w-4 text-emerald-500" />
      case "GitHub": return <Code className="h-4 w-4 text-gray-700 dark:text-gray-300" />
      default: return <Code className="h-4 w-4 text-indigo-500" />
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
        <p className="text-muted-foreground mt-1">
          A curated list of helpful links, videos, and documentation across all topics.
        </p>
      </div>

      {safeResources.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border rounded-lg border-dashed bg-muted/10">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-medium">No resources found</h3>
          <p className="text-muted-foreground mt-1 text-center max-w-sm">
            We haven't indexed any external resources yet.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).sort().map(([type, items]) => (
            <div key={type} className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                {getTypeIcon(type)}
                <h2 className="text-xl font-semibold tracking-tight">{type}s</h2>
                <Badge variant="secondary" className="ml-2">{items.length}</Badge>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items.map((resource) => (
                  <Link key={resource.id} href={resource.url} target="_blank" rel="noopener noreferrer">
                    <Card className="h-full hover:border-indigo-500/50 hover:shadow-md transition-all group">
                      <CardHeader className="p-4 pb-2">
                        <div className="flex items-start justify-between gap-4">
                          <CardTitle className="text-base group-hover:text-indigo-600 transition-colors line-clamp-2">
                            {resource.title}
                          </CardTitle>
                          <ExternalLink className="h-4 w-4 flex-shrink-0 text-muted-foreground opacity-50 group-hover:opacity-100 group-hover:text-indigo-600 transition-all" />
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        {resource.topic && (
                          <Badge variant="outline" className="bg-muted/50 text-muted-foreground">
                            {resource.topic.title}
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
