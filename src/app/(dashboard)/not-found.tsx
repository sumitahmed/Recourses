import Link from "next/link"
import { Compass, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center space-y-6 text-center">
      <div className="rounded-full bg-primary/10 p-6">
        <Compass className="size-12 text-primary" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Feature in Development</h1>
        <p className="max-w-[500px] text-muted-foreground">
          This area of the Knowledge OS is still being constructed. We are working hard to bring you the best FAANG-level experience.
        </p>
      </div>
      <Link 
        href="/"
        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <Home className="mr-2 size-4" />
        Return to Dashboard
      </Link>
    </div>
  )
}
