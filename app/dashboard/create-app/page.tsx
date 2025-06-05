import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { CreateAppForm } from "@/components/app-id/create-app-form"

export default async function CreateAppPage() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={session.user} />
      <main className="flex-1 container py-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Create New Feedback Widget</h1>
          <CreateAppForm userId={session.user.id} />
        </div>
      </main>
    </div>
  )
}
