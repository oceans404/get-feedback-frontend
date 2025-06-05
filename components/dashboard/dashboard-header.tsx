"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import type { User } from "@supabase/supabase-js"
import { MessageSquare } from "lucide-react"

interface DashboardHeaderProps {
  user: User
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <header className="border-b">
      <div className="max-w-screen-xl mx-auto w-full flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-xl font-bold flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Get Feedback
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{user.email}</span>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  )
}
