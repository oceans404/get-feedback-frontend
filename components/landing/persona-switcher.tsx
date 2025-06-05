"use client"

import { useState, useEffect } from "react"

const personas = ["PRODUCT MANAGERS", "VIBE CODERS", "STARTUPS", "DAPPS"]

export function PersonaSwitcher() {
  const [displayText, setDisplayText] = useState("")
  const [currentPersonaIndex, setCurrentPersonaIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  // Animation timing (in milliseconds)
  const typingDelay = 100
  const deletingDelay = 50
  const pauseDelay = 1000

  useEffect(() => {
    let timer: NodeJS.Timeout

    // Handle typing animation
    const handleTyping = () => {
      const currentPersona = personas[currentPersonaIndex]

      if (!isDeleting) {
        // Typing forward
        if (displayText.length < currentPersona.length) {
          setDisplayText(currentPersona.substring(0, displayText.length + 1))
          timer = setTimeout(handleTyping, typingDelay)
        } else {
          // Finished typing, pause before deleting
          timer = setTimeout(() => {
            setIsDeleting(true)
            handleTyping()
          }, pauseDelay)
        }
      } else {
        // Deleting
        if (displayText.length > 0) {
          setDisplayText(displayText.substring(0, displayText.length - 1))
          timer = setTimeout(handleTyping, deletingDelay)
        } else {
          // Move to next persona
          setIsDeleting(false)
          setCurrentPersonaIndex((prevIndex) => (prevIndex + 1) % personas.length)
          timer = setTimeout(handleTyping, typingDelay)
        }
      }
    }

    // Start the animation
    timer = setTimeout(handleTyping, typingDelay)

    // Cleanup
    return () => clearTimeout(timer)
  }, [displayText, isDeleting, currentPersonaIndex])

  return (
    <span className="text-primary font-bold text-2xl md:text-3xl inline-flex">
      {displayText}
      <span className="animate-blink">|</span>
    </span>
  )
}
