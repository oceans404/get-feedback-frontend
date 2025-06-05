"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Copy } from "lucide-react"

interface CopyButtonProps {
  text: string
  className?: string
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button variant="outline" size="sm" className={className} onClick={handleCopy}>
      {copied ? (
        <>
          <Check className="h-4 w-4 mr-1" />
          Copied
        </>
      ) : (
        <>
          <Copy className="h-4 w-4 mr-1" />
          Copy
        </>
      )}
    </Button>
  )
}
