import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Use a simplified header for loading state */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="text-xl font-bold">App ID Manager</div>
          <Skeleton className="h-10 w-24" />
        </div>
      </header>

      <main className="flex-1 container py-6">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-36" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Create multiple skeleton cards */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-6 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="pt-4">
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
