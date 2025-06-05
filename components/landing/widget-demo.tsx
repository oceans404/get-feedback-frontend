"use client"

import type React from "react"
import type { WidgetConfig } from "./config-panel"

import { useState } from "react"
import { ThumbsUp, ThumbsDown } from "lucide-react"

interface WidgetDemoProps {
  config: WidgetConfig
}

export function WidgetDemo({ config }: WidgetDemoProps) {
  const [showSuccess, setShowSuccess] = useState(false)
  const [selectedRating, setSelectedRating] = useState<string | null>(null)
  const [feedbackText, setFeedbackText] = useState("")
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      setSelectedRating(null)
      setFeedbackText("")
      setEmail("")
    }, 3000)
  }

  const getButtonStyle = () => {
    switch (config.buttonStyle) {
      case "light":
        return {
          backgroundColor: "white",
          color: config.highlightColor || "black",
          border: `1px solid ${config.highlightColor || "black"}`,
        }
      case "outline":
        return {
          backgroundColor: "transparent",
          color: config.highlightColor || "black",
          border: `2px solid ${config.highlightColor || "black"}`,
        }
      case "dark":
      default:
        return {
          backgroundColor: config.highlightColor || "black",
          color: "white",
          border: "none",
        }
    }
  }

  return (
    <div className="relative bg-white rounded-lg shadow-md border p-6 h-full">
      <h2 className="text-xl font-semibold mb-4">{config.title}</h2>

      {showSuccess ? (
        <div className="py-8 text-center">
          <p className="text-green-600 font-medium">{config.successMessage}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {config.showRating && (
            <div className="mb-4">
              <p className="mb-2">{config.ratingQuestion}</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  className={`p-3 border-2 rounded-md flex items-center justify-center transition-all ${
                    selectedRating === "negative" ? "border-red-400" : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedRating("negative")}
                >
                  <ThumbsDown
                    className={`h-5 w-5 ${selectedRating === "negative" ? "text-red-500" : "text-gray-500"}`}
                  />
                </button>
                <button
                  type="button"
                  className={`p-3 border-2 rounded-md flex items-center justify-center transition-all ${
                    selectedRating === "positive" ? "border-green-400" : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedRating("positive")}
                >
                  <ThumbsUp
                    className={`h-5 w-5 ${selectedRating === "positive" ? "text-green-500" : "text-gray-500"}`}
                  />
                </button>
              </div>
            </div>
          )}

          <div>
            <textarea
              className="w-full p-3 border rounded-md min-h-[100px] resize-y focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={config.messagePlaceholder}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              required
            ></textarea>
          </div>

          {config.requireEmail && (
            <div>
              <input
                type="email"
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={config.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}

          <div className="flex justify-end">
            <button type="submit" className="px-4 py-2 rounded-md transition-colors" style={getButtonStyle()}>
              {config.buttonText}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
