import { Skeleton } from "@/components/ui/skeleton"

export default function AppDetailLoading() {
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
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Skeleton className="h-10 w-32 mr-4" />
            <Skeleton className="h-10 w-64" />
          </div>

          <div className="grid gap-6">
            <div className="border rounded-lg p-6 space-y-4">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48 mb-4" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-8 w-32" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-8 w-32" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-8 w-32" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-8 w-32" />
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-6 space-y-4">
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64 mb-4" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
