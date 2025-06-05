import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AppIdList } from "@/components/app-id/app-id-list"
import { Button } from "@/components/ui/button"
import { PlusCircle, MessageSquare } from "lucide-react"

export default async function DashboardPage() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Fetch user's app IDs
  const { data: appIds } = await supabase
    .from("app_ids")
    .select("*")
    .or(`owner_id.eq.${session.user.id},access_users.cs.{${session.user.id}}`)

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={session.user} />
      <main className="flex-1 py-6">
        <div className="max-w-screen-xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Your Apps with Feedback Widgets</h1>
            <Button asChild>
              <Link href="/dashboard/create-app">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create new widget
              </Link>
            </Button>
          </div>

          {appIds && appIds.length > 0 ? (
            <AppIdList appIds={appIds} userId={session.user.id} />
          ) : (
            <div className="text-center py-12 bg-muted rounded-lg">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">No feedback widgets yet</h2>
              <p className="text-muted-foreground mb-4">Create your first widget to start collecting user feedback</p>
              <Button asChild>
                <Link href="/dashboard/create-app">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create new widget
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
