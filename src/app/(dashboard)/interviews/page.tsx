import { db as prisma } from "@/lib/db"
import { MessageSquare, Users, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default async function InterviewsPage() {
  const topicsWithQuestions = await prisma.topic.findMany({
    where: {
      interviewQuestions: {
        some: {}
      }
    },
    include: {
      interviewQuestions: true
    },
    orderBy: { title: 'asc' }
  })

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Interview Question Bank</h1>
        <p className="text-muted-foreground mt-1">
          Real questions extracted from Cracking the Coding Interview, Notion, and Sanfoundry.
        </p>
      </div>

      {topicsWithQuestions.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border rounded-lg border-dashed bg-muted/10">
          <MessageSquare className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-medium">No questions available yet</h3>
          <p className="text-muted-foreground mt-1 text-center max-w-sm">
            Run the data ingestion script to populate the question bank.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {topicsWithQuestions.map((topic) => (
            <Link key={topic.id} href={`/t/${topic.slug}?tab=interview`}>
              <Card className="flex flex-col h-full hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{topic.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{topic.module}</span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      <MessageSquare className="mr-1 h-3 w-3" /> 
                      {topic.interviewQuestions.length} Questions
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {topic.description || "Interview preparation questions for this topic."}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
