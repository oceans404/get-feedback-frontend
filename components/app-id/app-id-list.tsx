"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
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
import { Share, MessageSquare } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface AppId {
  id: number
  app_id: string
  app_name: string
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

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {appIds.map((appId) => (
          <Card key={appId.id} className="transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <Link href={`/dashboard/app/${encodeURIComponent(appId.app_id)}`} className="hover:underline">
                <CardTitle className="text-lg flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2 text-primary" />
                  {appId.app_name || "Unnamed Widget"}
                </CardTitle>
              </Link>
              <CardDescription className="flex items-center">
                <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">{appId.app_id}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {appId.owner_id === userId ? "You own this widget" : "Shared with you"}
              </p>
            </CardContent>
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
                    <DialogTitle>Share Feedback Widget</DialogTitle>
                    <DialogDescription>
                      Enter the email of the user you want to share "{appId.app_name || appId.app_id}" with.
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
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
