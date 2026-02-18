"use client"

import { Component, ReactNode } from "react"
import { trackEvent } from "@/lib/analytics"

interface Props {
  children: ReactNode
  fallback?: ReactNode
  section?: string
}

interface State {
  hasError: boolean
  error?: Error
}

export class SectionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Track error in analytics
    trackEvent("error", "Section Error", {
      section: this.props.section || "unknown",
      error: error.message,
      componentStack: errorInfo.componentStack,
    })

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error(`[${this.props.section}] Error:`, error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      // Return fallback UI or nothing (graceful degradation)
      return (
        this.props.fallback || (
          <div className="py-12 text-center text-gray-400">
            <p className="text-sm">Content unavailable</p>
          </div>
        )
      )
    }

    return this.props.children
  }
}

// HOC for wrapping sections
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  sectionName: string,
  fallback?: ReactNode
) {
  return function WithErrorBoundary(props: P) {
    return (
      <SectionErrorBoundary section={sectionName} fallback={fallback}>
        <WrappedComponent {...props} />
      </SectionErrorBoundary>
    )
  }
}
