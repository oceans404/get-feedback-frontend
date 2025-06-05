"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Share } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ShareAppButtonProps {
  app: {
    id: number
    app_id: string
    app_name: string
    access_users: string[] | null
    invited_emails: string[] | null
  }
}

export function ShareAppButton({ app }: ShareAppButtonProps) {
  const [shareEmail, setShareEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const email = shareEmail.trim().toLowerCase()

      // Check if email is already invited
      const invitedEmails = app.invited_emails || []
      if (invitedEmails.includes(email)) {
        toast({
          title: "Already invited",
          description: `${email} has already been invited to this feedback widget`,
          variant: "default",
        })
        setIsLoading(false)
        setIsOpen(false)
        setShareEmail("")
        return
      }

      // Get user by email
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("id, email")
        .eq("email", email)
        .single()

      if (userError) {
        // User doesn't exist, add to invited_emails
        const newInvitedEmails = [...invitedEmails, email]

        const { error: updateError } = await supabase
          .from("app_ids")
          .update({ invited_emails: newInvitedEmails })
          .eq("id", app.id)

        if (updateError) {
          throw new Error(updateError.message)
        }

        toast({
          title: "Invitation sent",
          description: `${email} has been invited to this feedback widget. They'll get access when they sign up.`,
          variant: "default",
        })
      } else {
        // User exists, add to access_users
        const accessUsers = app.access_users || []

        // Check if user already has access
        if (accessUsers.includes(userData.id)) {
          toast({
            title: "Already shared",
            description: `${userData.email} already has access to this feedback widget`,
            variant: "default",
          })
          setIsLoading(false)
          setIsOpen(false)
          setShareEmail("")
          return
        }

        // Update app_id access_users
        const newAccessUsers = [...accessUsers, userData.id]

        const { error: updateError } = await supabase
          .from("app_ids")
          .update({ access_users: newAccessUsers })
          .eq("id", app.id)

        if (updateError) {
          throw new Error(updateError.message)
        }

        toast({
          title: "Widget shared successfully",
          description: `${userData.email} now has access to this feedback widget`,
          variant: "default",
        })
      }

      setShareEmail("")
      setIsOpen(false)
      router.refresh()
    } catch (err) {
      toast({
        title: "Failed to share widget",
        description: err instanceof Error ? err.message : "An unexpected error occurred",
        variant: "destructive",
      })
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Share className="h-4 w-4 mr-2" />
          Share Widget
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Feedback Widget</DialogTitle>
          <DialogDescription>
            Enter the email of the user you want to share "{app.app_name || app.app_id}" with.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 text-xs text-muted-foreground">
          You can invite users who haven't registered yet. They'll get access when they sign up.
        </div>
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
  )
}
