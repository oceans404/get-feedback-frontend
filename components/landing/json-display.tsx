"use client"

import { useState, useEffect } from "react"
import { CopyButton } from "@/components/app-id/copy-button"

interface JsonDisplayProps {
  config: Record<string, any>
  data: Record<string, any>
}

export function JsonDisplay({ config, data }: JsonDisplayProps) {
  const [activeTab, setActiveTab] = useState<"config" | "data">("config")
  const [jsonString, setJsonString] = useState("")

  useEffect(() => {
    const content = activeTab === "config" ? config : data
    setJsonString(JSON.stringify(content, null, 2))
  }, [activeTab, config, data])

  return (
    <div className="h-full flex flex-col">
      <div className="flex border-b mb-2">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === "config" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab("config")}
        >
          Configuration
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === "data" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab("data")}
        >
          Stored Data
        </button>
      </div>
      <div className="relative flex-1 overflow-auto">
        <pre className="text-sm font-mono p-4 bg-muted rounded-md h-full overflow-auto">{jsonString}</pre>
        <div className="absolute top-2 right-2">
          <CopyButton text={jsonString} />
        </div>
      </div>
    </div>
  )
}
