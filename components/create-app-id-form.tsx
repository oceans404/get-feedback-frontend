"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface CreateAppIdFormProps {
  userId: string
}

export function CreateAppIdForm({ userId }: CreateAppIdFormProps) {
  const [appId, setAppId] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!appId.trim()) {
      setError("App ID cannot be empty")
      setIsLoading(false)
      return
    }

    try {
      // Check if app ID already exists
      const { data: existingAppId } = await supabase.from("app_ids").select("id").eq("app_id", appId).single()

      if (existingAppId) {
        setError("This App ID already exists")
        setIsLoading(false)
        return
      }

      // Create new app ID
      const { error: insertError } = await supabase.from("app_ids").insert({
        app_id: appId,
        owner_id: userId,
        access_users: [userId],
      })

      if (insertError) {
        setError(insertError.message)
        return
      }

      setAppId("")
      router.refresh()
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="app-id">App ID</Label>
              <Input id="app-id" placeholder="Enter app ID" value={appId} onChange={(e) => setAppId(e.target.value)} />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create App ID"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
