import React from "react"

import { cn } from "@/lib/utils"

interface AnimatedTextProps {
  /** Text content to animate. */
  text: string
  /** Delay before the first word animation starts (in milliseconds). */
  baseDelay?: number
  /** Additional delay between each word's animation (in milliseconds). */
  wordDelay?: number
  /** Delay between each letter within a word (in milliseconds). */
  letterDelay?: number
  /** Disable animations entirely (e.g., when prefers-reduced-motion is enabled). */
  disabled?: boolean
  className?: string
}

/**
 * Animates text word-by-word and letter-by-letter with configurable delays.
 * Designed to respect reduced-motion preferences by passing `disabled`.
 */
export function AnimatedText({
  text,
  baseDelay = 0,
  wordDelay = 120,
  letterDelay = 35,
  disabled = false,
  className,
}: AnimatedTextProps) {
  const words = text.split(" ")

  return (
    <span className={cn("animated-text inline-flex flex-wrap", className)}>
      {words.map((word, wordIndex) => {
        const wordAnimationDelay = baseDelay + wordIndex * wordDelay

        return (
          <span
            key={`${word}-${wordIndex}`}
            className={cn("animated-word", disabled && "animated-static")}
            style={disabled ? undefined : { animationDelay: `${wordAnimationDelay}ms` }}
          >
            {word.split("").map((letter, letterIndex) => {
              const letterAnimationDelay = wordAnimationDelay + letterIndex * letterDelay

              return (
                <span
                  key={`${word}-${letterIndex}`}
                  className={cn("animated-letter", disabled && "animated-static")}
                  style={disabled ? undefined : { animationDelay: `${letterAnimationDelay}ms` }}
                >
                  {letter}
                </span>
              )
            })}
            {wordIndex < words.length - 1 && (
              <span className="animated-space" aria-hidden="true">
                &nbsp;
              </span>
            )}
          </span>
        )
      })}
    </span>
  )
}
