import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function AppNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">App Not Found</h1>
        <p className="text-muted-foreground">
          The app you're looking for doesn't exist or you don't have access to it.
        </p>
        <Button asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  )
}
