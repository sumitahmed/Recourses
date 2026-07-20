import { ArrowRight, BookOpenCheck, BrainCircuit, Clock3, Sigma } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const tracks = [
  { title: "Quantitative Aptitude", count: 29, icon: Sigma, description: "Arithmetic, numbers, geometry, probability, and data interpretation." },
  { title: "Logical Reasoning", count: 15, icon: BrainCircuit, description: "Series, arrangements, puzzles, directions, syllogisms, and more." },
  { title: "English", count: 9, icon: BookOpenCheck, description: "Grammar, vocabulary, comprehension, and verbal ability drills." },
]

export default function AptitudePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="rounded-2xl border bg-gradient-to-br from-indigo-500/10 via-background to-amber-500/10 p-7 sm:p-10">
        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">PLACEMENT PREPARATION</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Aptitude Prep Desk</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">Your complete workspace for concepts, 3,180 original practice questions, solutions, revision, mock tests, bookmarks, and an error notebook.</p>
        <Button className="mt-6" nativeButton={false} render={<Link href="/aptitude-portal/index.html" />}>
          Open Aptitude Portal <ArrowRight className="ml-2 size-4" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {tracks.map(({ title, count, icon: Icon, description }) => (
          <Card key={title} className="transition-shadow hover:shadow-md">
            <CardHeader>
              <Icon className="mb-2 size-6 text-indigo-600" />
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-2 text-sm text-muted-foreground"><Clock3 className="size-4" /> {count} focused topics</CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>How to use it</CardTitle><CardDescription>Learn a topic, attempt the original drill, review solutions, log errors, and revisit weak topics through the revision queue.</CardDescription></CardHeader>
      </Card>
    </div>
  )
}
