"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { WidgetPreview } from "./widget-preview"

interface AppConfig {
  title: string
  successMessage: string
  buttonText: string
  buttonStyle: string
  showRating: boolean
  ratingQuestion: string
  requireEmail: boolean
  emailPlaceholder: string
  messagePlaceholder: string
  highlightColor: string
}

interface AppConfigFormProps {
  appId: number
  appName: string
  initialDomain: string | null
  initialConfig: AppConfig | null
  isOwner: boolean
}

export function AppConfigForm({ appId, appName, initialDomain, initialConfig, isOwner }: AppConfigFormProps) {
  const [domain, setDomain] = useState(initialDomain || "")
  const [config, setConfig] = useState<AppConfig>({
    title: initialConfig?.title || "Blind Feedback",
    successMessage: initialConfig?.successMessage || "Thanks for providing feedback to improve our product!",
    buttonText: initialConfig?.buttonText || "Send Feedback",
    buttonStyle: initialConfig?.buttonStyle || "dark",
    showRating: initialConfig?.showRating ?? true,
    ratingQuestion: initialConfig?.ratingQuestion || "Do you like this product?",
    requireEmail: initialConfig?.requireEmail ?? false,
    emailPlaceholder: initialConfig?.emailPlaceholder || "your@email.com",
    messagePlaceholder: initialConfig?.messagePlaceholder || "Tell us how we can improve",
    highlightColor: initialConfig?.highlightColor || "black",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()

  const handleConfigChange = (key: keyof AppConfig, value: string | boolean) => {
    setConfig((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isOwner) return

    setIsLoading(true)

    try {
      const { error } = await supabase
        .from("app_ids")
        .update({
          domain,
          config,
        })
        .eq("id", appId)

      if (error) {
        throw new Error(error.message)
      }

      toast({
        title: "Configuration saved",
        description: "Your app configuration has been updated successfully.",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error saving configuration",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Widget Preview Section */}
        <Card>
          <CardHeader>
            <CardTitle>Widget Preview</CardTitle>
            <CardDescription>Here's what your feedback widget will look like when added to your app</CardDescription>
          </CardHeader>
          <CardContent>
            <WidgetPreview config={config} appName={appName} />
          </CardContent>
        </Card>

        {/* Widget Configuration Section */}
        <Card>
          <CardHeader>
            <CardTitle>Widget Design</CardTitle>
            <CardDescription>Customize how your feedback widget looks and behaves</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 max-h-[600px] overflow-y-auto">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="buttonText">Main Button Text</Label>
                    <Input
                      id="buttonText"
                      value={config.buttonText}
                      onChange={(e) => handleConfigChange("buttonText", e.target.value)}
                      placeholder="Send Feedback"
                      disabled={!isOwner}
                    />
                  </div>

                  <div>
                    <Label htmlFor="buttonStyle">Main Button Style</Label>
                    <Select
                      value={config.buttonStyle}
                      onValueChange={(value) => handleConfigChange("buttonStyle", value)}
                      disabled={!isOwner}
                    >
                      <SelectTrigger id="buttonStyle">
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="outline">Outline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="highlightColor">Highlight Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="highlightColor"
                      value={config.highlightColor}
                      onChange={(e) => handleConfigChange("highlightColor", e.target.value)}
                      placeholder="#000000"
                      disabled={!isOwner}
                    />
                    <div className="w-10 h-10 rounded border" style={{ backgroundColor: config.highlightColor }}></div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="title">Widget Title</Label>
                  <Input
                    id="title"
                    value={config.title}
                    onChange={(e) => handleConfigChange("title", e.target.value)}
                    placeholder="Feedback"
                    disabled={!isOwner}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="showRating"
                    checked={config.showRating}
                    onCheckedChange={(checked) => handleConfigChange("showRating", checked)}
                    disabled={!isOwner}
                  />
                  <Label htmlFor="showRating">Show Rating Question</Label>
                </div>

                {config.showRating && (
                  <div>
                    <Label htmlFor="ratingQuestion">Rating Question</Label>
                    <Input
                      id="ratingQuestion"
                      value={config.ratingQuestion}
                      onChange={(e) => handleConfigChange("ratingQuestion", e.target.value)}
                      placeholder="How would you rate our product?"
                      disabled={!isOwner}
                    />
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Switch
                    id="requireEmail"
                    checked={config.requireEmail}
                    onCheckedChange={(checked) => handleConfigChange("requireEmail", checked)}
                    disabled={!isOwner}
                  />
                  <Label htmlFor="requireEmail">Require Email</Label>
                </div>

                {config.requireEmail && (
                  <div>
                    <Label htmlFor="emailPlaceholder">Email Placeholder</Label>
                    <Input
                      id="emailPlaceholder"
                      value={config.emailPlaceholder}
                      onChange={(e) => handleConfigChange("emailPlaceholder", e.target.value)}
                      placeholder="your@email.com"
                      disabled={!isOwner}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="messagePlaceholder">Message Placeholder</Label>
                  <Input
                    id="messagePlaceholder"
                    value={config.messagePlaceholder}
                    onChange={(e) => handleConfigChange("messagePlaceholder", e.target.value)}
                    placeholder="Tell us what you think..."
                    disabled={!isOwner}
                  />
                </div>

                <div>
                  <Label htmlFor="successMessage">Success Message</Label>
                  <Textarea
                    id="successMessage"
                    value={config.successMessage}
                    onChange={(e) => handleConfigChange("successMessage", e.target.value)}
                    placeholder="Thanks for your feedback!"
                    disabled={!isOwner}
                  />
                </div>

                <div>
                  <Label htmlFor="domain">Domain</Label>
                  <Input
                    id="domain"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="example.com"
                    disabled={!isOwner}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    The domain where your feedback widget will be displayed
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {isOwner && (
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Configuration"}
                </Button>
              )}
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
