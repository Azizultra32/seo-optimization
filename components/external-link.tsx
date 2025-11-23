import type React from "react"
import { ExternalLink } from "@/components/icons"

interface ExternalLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: React.ReactNode
}

export default function ExternalLinkComponent({ href, children, className = "", ...props }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 ${className}`}
      {...props}
    >
      {children}
      <ExternalLink className="w-4 h-4" />
    </a>
  )
}
