import { db as prisma } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Code2, Globe, Plus, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { safeExternalUrl } from "@/lib/safe-url"

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: 'desc' }
  })

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage your portfolio, track progress, and organize tech stacks.</p>
        </div>
        <Button disabled>
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border rounded-lg border-dashed bg-muted/10">
          <Code2 className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-medium">No projects yet</h3>
          <p className="text-muted-foreground mt-1 text-center max-w-sm">
            You haven't added any projects to your portfolio. Start building and track your progress here.
          </p>
          <Button className="mt-4" disabled>Add Your First Project</Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            (() => {
              const githubUrl = safeExternalUrl(project.githubUrl)
              const deploymentUrl = safeExternalUrl(project.deploymentUrl)

              return <Card key={project.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                {project.techStack && (
                  <CardDescription className="line-clamp-1 text-xs text-indigo-500 font-medium">
                    {project.techStack}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {project.overview || "No description provided."}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-muted-foreground">Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
              </CardContent>
              <CardFooter className="flex gap-2 border-t pt-4">
                {githubUrl && (
                  <Link href={githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Code className="mr-2 h-4 w-4" /> Repo
                    </Button>
                  </Link>
                )}
                {deploymentUrl && (
                  <Link href={deploymentUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button variant="default" size="sm" className="w-full">
                      <Globe className="mr-2 h-4 w-4" /> Live
                    </Button>
                  </Link>
                )}
                {!githubUrl && !deploymentUrl && (
                  <Button variant="secondary" size="sm" className="w-full" disabled>
                    Draft
                  </Button>
                )}
              </CardFooter>
              </Card>
            })()
          ))}
        </div>
      )}
    </div>
  )
}
