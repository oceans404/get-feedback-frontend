"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export interface WidgetConfig {
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

interface ConfigPanelProps {
  config: WidgetConfig
  onConfigChange: (config: WidgetConfig) => void
}

export function ConfigPanel({ config, onConfigChange }: ConfigPanelProps) {
  const handleChange = (key: keyof WidgetConfig, value: string | boolean) => {
    onConfigChange({
      ...config,
      [key]: value,
    })
  }

  return (
    <div className="space-y-4 h-full overflow-y-auto p-1">
      <div>
        <Label htmlFor="title">Widget Title</Label>
        <Input
          id="title"
          value={config.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Feedback"
        />
      </div>

      <div>
        <Label htmlFor="buttonText">Submit Button Text</Label>
        <Input
          id="buttonText"
          value={config.buttonText}
          onChange={(e) => handleChange("buttonText", e.target.value)}
          placeholder="Submit"
        />
      </div>

      <div>
        <Label htmlFor="buttonStyle">Button Style</Label>
        <Select value={config.buttonStyle} onValueChange={(value) => handleChange("buttonStyle", value)}>
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

      <div>
        <Label htmlFor="highlightColor">Highlight Color</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="highlightColor"
            value={config.highlightColor}
            onChange={(e) => handleChange("highlightColor", e.target.value)}
            placeholder="#000000"
          />
          <div className="w-10 h-10 rounded border" style={{ backgroundColor: config.highlightColor }}></div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="showRating"
          checked={config.showRating}
          onCheckedChange={(checked) => handleChange("showRating", checked)}
        />
        <Label htmlFor="showRating">Show Rating Question</Label>
      </div>

      {config.showRating && (
        <div>
          <Label htmlFor="ratingQuestion">Rating Question</Label>
          <Input
            id="ratingQuestion"
            value={config.ratingQuestion}
            onChange={(e) => handleChange("ratingQuestion", e.target.value)}
            placeholder="How would you rate our product?"
          />
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Switch
          id="requireEmail"
          checked={config.requireEmail}
          onCheckedChange={(checked) => handleChange("requireEmail", checked)}
        />
        <Label htmlFor="requireEmail">Require Email</Label>
      </div>

      {config.requireEmail && (
        <div>
          <Label htmlFor="emailPlaceholder">Email Placeholder</Label>
          <Input
            id="emailPlaceholder"
            value={config.emailPlaceholder}
            onChange={(e) => handleChange("emailPlaceholder", e.target.value)}
            placeholder="your@email.com"
          />
        </div>
      )}

      <div>
        <Label htmlFor="messagePlaceholder">Message Placeholder</Label>
        <Input
          id="messagePlaceholder"
          value={config.messagePlaceholder}
          onChange={(e) => handleChange("messagePlaceholder", e.target.value)}
          placeholder="Tell us what you think..."
        />
      </div>

      <div>
        <Label htmlFor="successMessage">Success Message</Label>
        <Textarea
          id="successMessage"
          value={config.successMessage}
          onChange={(e) => handleChange("successMessage", e.target.value)}
          placeholder="Thanks for your feedback!"
        />
      </div>
    </div>
  )
}
