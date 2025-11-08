"use client"

import { useCounter } from "@/hooks/use-counter"

interface AnimatedCounterProps {
  end: number
  start?: number
  duration?: number
  suffix?: string
  shouldStart: boolean
  className?: string
}

export function AnimatedCounter({
  end,
  start = 0,
  duration = 2000,
  suffix = "",
  shouldStart,
  className = "",
}: AnimatedCounterProps) {
  const count = useCounter(end, duration, start, shouldStart)

  return (
    <span className={className}>
      {count}
      {suffix}
    </span>
  )
}
