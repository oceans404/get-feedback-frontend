"use client"

import type React from "react"

import { useState } from "react"

interface WidgetPreviewProps {
  config: {
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
  appName: string
}

export function WidgetPreview({ config, appName }: WidgetPreviewProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [selectedRating, setSelectedRating] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      setIsOpen(false)
    }, 2000)
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
    <div className="relative border rounded-lg p-6 bg-gray-50">
      <h3 className="text-lg font-medium mb-4">{appName}</h3>

      {!isOpen ? (
        <div className="flex justify-end">
          <button
            onClick={() => setIsOpen(true)}
            style={{
              ...getButtonStyle(),
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            {config.buttonText}
          </button>
        </div>
      ) : (
        <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto border">
          <button
            onClick={() => {
              setIsOpen(false)
              setShowSuccess(false)
              setSelectedRating(null)
            }}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold bg-transparent border-none"
            style={{ cursor: "pointer" }}
          >
            &times;
          </button>

          <h2 className="text-xl font-semibold mb-4">{config.title}</h2>

          {showSuccess ? (
            <div className="py-8 text-center">
              <p>{config.successMessage}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {config.showRating && (
                <div className="mb-4">
                  <p className="mb-2">{config.ratingQuestion}</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={`p-3 border-2 rounded-md ${
                        selectedRating === "negative"
                          ? `border-[${config.highlightColor}] font-bold`
                          : "border-gray-200"
                      }`}
                      style={{
                        borderColor: selectedRating === "negative" ? config.highlightColor : undefined,
                      }}
                      onClick={() => setSelectedRating("negative")}
                    >
                      👎
                    </button>
                    <button
                      type="button"
                      className={`p-3 border-2 rounded-md ${
                        selectedRating === "positive"
                          ? `border-[${config.highlightColor}] font-bold`
                          : "border-gray-200"
                      }`}
                      style={{
                        borderColor: selectedRating === "positive" ? config.highlightColor : undefined,
                      }}
                      onClick={() => setSelectedRating("positive")}
                    >
                      👍
                    </button>
                  </div>
                </div>
              )}

              <div>
                <textarea
                  className="w-full p-3 border rounded-md min-h-[100px] resize-y"
                  placeholder={config.messagePlaceholder}
                  required
                ></textarea>
              </div>

              {config.requireEmail && (
                <div>
                  <input
                    type="email"
                    className="w-full p-3 border rounded-md"
                    placeholder={config.emailPlaceholder}
                    required
                  />
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  style={{
                    backgroundColor: config.highlightColor || "black",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Submit
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  )
}
