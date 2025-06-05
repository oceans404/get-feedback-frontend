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
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

interface CreateAppFormProps {
  userId: string
}

export function CreateAppForm({ userId }: CreateAppFormProps) {
  const [appName, setAppName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!appName.trim()) {
      setError("Widget name cannot be empty")
      setIsLoading(false)
      return
    }

    try {
      // Call the API to get a new app ID and schema ID
      const response = await fetch("/api/create-app", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create widget")
      }

      const data = await response.json()
      const { appId, schemaId } = data

      // Save the app ID, schema ID, and name to Supabase
      const { error: insertError } = await supabase.from("app_ids").insert({
        app_id: appId,
        app_name: appName,
        schema_id: schemaId,
        owner_id: userId,
        access_users: [userId],
      })

      if (insertError) {
        throw new Error(insertError.message)
      }

      // Show success toast
      toast({
        title: "Feedback widget created",
        description: `Your new widget "${appName}" has been created successfully`,
        variant: "default",
      })

      // Navigate to the newly created app's detail page
      router.push(`/dashboard/app/${encodeURIComponent(appId)}`)
      // Force a refresh to ensure the latest data is fetched
      // router.refresh()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(errorMessage)

      // Show error toast
      toast({
        title: "Failed to create widget",
        description: errorMessage,
        variant: "destructive",
      })

      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a Feedback Widget</CardTitle>
        <CardDescription>Set up a new feedback widget to collect valuable insights from your users</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="app-name">Widget Name</Label>
              <Input
                id="app-name"
                placeholder="e.g., Product Feedback, Website Feedback"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">
                This name will help you identify this feedback widget in your dashboard.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating...
              </div>
            ) : (
              "Create Widget"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
