import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { SignUpForm } from "@/components/auth/signup-form"
import { MessageSquare } from "lucide-react"

export default async function SignUpPage() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="max-w-screen-xl mx-auto w-full flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-xl font-bold flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Get Feedback
          </Link>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center py-12">
        <div className="mx-auto w-full max-w-sm px-4">
          <div className="flex flex-col space-y-2 text-center mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground">Enter your email below to create your account</p>
          </div>
          <SignUpForm />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link href="/login" className="hover:text-brand underline underline-offset-4">
              Already have an account? Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
