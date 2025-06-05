"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"

interface DeleteAppButtonProps {
  appId: number
  appName: string
}

export function DeleteAppButton({ appId, appName }: DeleteAppButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.from("app_ids").delete().eq("id", appId)

      if (error) {
        throw new Error(error.message)
      }

      toast({
        title: "Widget deleted",
        description: "The widget has been permanently deleted.",
      })

      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      toast({
        title: "Error deleting widget",
        description: err instanceof Error ? err.message : "An unexpected error occurred",
        variant: "destructive",
      })
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash className="h-4 w-4 mr-2" />
          Delete Widget
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the widget
            <span className="font-medium"> {appName || "Unnamed Widget"} </span>
            and all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
