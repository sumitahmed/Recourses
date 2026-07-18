import { db as prisma } from "@/lib/db"
import { Building2, Search, Target, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default async function PlacementPrepPage() {
  const companies = await prisma.company.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { 
          leetcodeQs: true,
          experiences: true
        }
      }
    }
  })

  // We could implement Client-side search in a separate component, 
  // but for now we'll render them and let standard browser search (Ctrl+F) work,
  // or a simple layout.

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Placement Prep</h1>
          <p className="text-muted-foreground mt-1">
            Target specific companies. Review their interview structure and frequent questions.
          </p>
        </div>
      </div>

      {/* Grid of companies */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {companies.map((company) => (
          <Link key={company.id} href={`/placement/${company.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
            <Card className="h-full hover:border-indigo-500/50 hover:shadow-md transition-all group">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-50 transition-colors">
                    <Building2 className="h-5 w-5 text-muted-foreground group-hover:text-indigo-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base group-hover:text-indigo-600 transition-colors line-clamp-1">{company.name}</CardTitle>
                    <CardDescription className="text-xs">
                      Company Profile
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                  <div className="flex items-center gap-1">
                    <Target className="h-3.5 w-3.5" />
                    <span>{company._count.leetcodeQs} Qs</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" />
                    <span>{company._count.experiences} Exp</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
