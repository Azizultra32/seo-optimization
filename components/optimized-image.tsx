"use client"

import NextImage, { ImageProps as NextImageProps } from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface OptimizedImageProps extends Omit<NextImageProps, "onLoad"> {
  fallback?: string
  aspectRatio?: "square" | "video" | "portrait" | "auto"
}

const aspectRatioClasses = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
  auto: "",
}

export function OptimizedImage({
  src,
  alt,
  className,
  fallback = "/placeholder.jpg",
  aspectRatio = "auto",
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  return (
    <div className={cn("relative overflow-hidden", aspectRatioClasses[aspectRatio], className)}>
      <NextImage
        src={error ? fallback : src}
        alt={alt}
        className={cn(
          "object-cover transition-all duration-500",
          isLoading ? "scale-105 blur-lg" : "scale-100 blur-0"
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError(true)
          setIsLoading(false)
        }}
        {...props}
      />
      
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
      )}
    </div>
  )
}

// Preload critical images
export function preloadImage(src: string) {
  if (typeof window !== "undefined") {
    const link = document.createElement("link")
    link.rel = "preload"
    link.as = "image"
    link.href = src
    document.head.appendChild(link)
  }
}
