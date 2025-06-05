"use client"

import { useState } from "react"
import { WidgetDemo } from "@/components/landing/widget-demo"
import { ConfigPanel, type WidgetConfig } from "@/components/landing/config-panel"

export function ConfigurableWidgetDemo({ defaultConfig }: { defaultConfig: WidgetConfig }) {
  const [config, setConfig] = useState<WidgetConfig>(defaultConfig)

  return (
    <div className="grid md:grid-cols-2 gap-6 bg-background p-6 rounded-xl shadow-md">
      <div className="flex flex-col">
        <h2 className="text-xl font-semibold mb-4">Widget Preview</h2>
        <div className="flex-1 bg-background rounded-lg shadow-sm p-1">
          <WidgetDemo config={config} />
        </div>
      </div>
      <div className="flex flex-col">
        <h2 className="text-xl font-semibold mb-4">No-code Widget Editor</h2>
        <div className="flex-1 bg-background rounded-lg shadow-sm border p-4">
          <ConfigPanel config={config} onConfigChange={setConfig} />
        </div>
      </div>
    </div>
  )
}
