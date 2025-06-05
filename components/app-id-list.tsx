"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Share, Trash } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface AppId {
  id: number
  app_id: string
  owner_id: string
  access_users: string[]
  created_at: string
}

interface AppIdListProps {
  appIds: AppId[]
  userId: string
}

export function AppIdList({ appIds, userId }: AppIdListProps) {
  const [shareEmail, setShareEmail] = useState("")
  const [selectedAppId, setSelectedAppId] = useState<AppId | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAppId) return

    setIsLoading(true)
    setError(null)

    try {
      // Get user by email
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", shareEmail)
        .single()

      if (userError || !userData) {
        setError("User not found with this email")
        setIsLoading(false)
        return
      }

      // Update app_id access_users
      const newAccessUsers = [...selectedAppId.access_users, userData.id]

      const { error: updateError } = await supabase
        .from("app_ids")
        .update({ access_users: newAccessUsers })
        .eq("id", selectedAppId.id)

      if (updateError) {
        setError(updateError.message)
        return
      }

      setShareEmail("")
      setSelectedAppId(null)
      router.refresh()
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (appId: AppId) => {
    if (appId.owner_id !== userId) {
      setError("You can only delete app IDs you own")
      return
    }

    try {
      const { error } = await supabase.from("app_ids").delete().eq("id", appId.id)

      if (error) {
        setError(error.message)
        return
      }

      router.refresh()
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    }
  }

  if (appIds.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            You don't have any app IDs yet. Create one to get started.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {appIds.map((appId) => (
        <Card key={appId.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{appId.app_id}</CardTitle>
            <CardDescription>{appId.owner_id === userId ? "You own this App ID" : "Shared with you"}</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-between">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => setSelectedAppId(appId)}>
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share App ID</DialogTitle>
                  <DialogDescription>
                    Enter the email of the user you want to share "{appId.app_id}" with.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleShare}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={shareEmail}
                        onChange={(e) => setShareEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Sharing..." : "Share"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {appId.owner_id === userId && (
              <Button variant="destructive" size="sm" onClick={() => handleDelete(appId)}>
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
