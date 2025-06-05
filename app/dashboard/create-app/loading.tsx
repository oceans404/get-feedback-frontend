import { Skeleton } from "@/components/ui/skeleton"

export default function CreateAppLoading() {
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
        <div className="max-w-2xl mx-auto">
          <Skeleton className="h-10 w-48 mb-6" />

          <div className="border rounded-lg p-6 space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            <div className="flex justify-end gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
