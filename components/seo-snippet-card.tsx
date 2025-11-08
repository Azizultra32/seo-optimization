"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react"

interface SEOSnippetCardProps {
  title: string
  description: string
  url: string
}

export function SEOSnippetCard({ title, description, url }: SEOSnippetCardProps) {
  // Calculate scores
  const titleLength = title.length
  const descLength = description.length

  const titleScore =
    titleLength >= 50 && titleLength <= 60 ? "good" : titleLength >= 40 && titleLength <= 70 ? "ok" : "poor"
  const descScore =
    descLength >= 150 && descLength <= 160 ? "good" : descLength >= 120 && descLength <= 170 ? "ok" : "poor"

  const ScoreIcon = (score: string) => {
    switch (score) {
      case "good":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case "ok":
        return <AlertCircle className="w-4 h-4 text-amber-500" />
      default:
        return <XCircle className="w-4 h-4 text-red-500" />
    }
  }

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">Google Search Preview</h3>

        {/* Google SERP Preview */}
        <div className="border rounded-lg p-4 bg-background">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">{url}</span>
          </div>
          <h2 className="text-xl text-blue-600 hover:underline cursor-pointer mb-1">{title || "Untitled Page"}</h2>
          <p className="text-sm text-muted-foreground">{description || "No description provided."}</p>
        </div>
      </div>

      {/* Score Badges */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {ScoreIcon(titleScore)}
            <span className="text-sm">Title Length</span>
          </div>
          <Badge variant={titleScore === "good" ? "default" : titleScore === "ok" ? "secondary" : "destructive"}>
            {titleLength} chars {titleScore === "good" ? "(Perfect)" : titleScore === "ok" ? "(OK)" : "(Fix)"}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {ScoreIcon(descScore)}
            <span className="text-sm">Description Length</span>
          </div>
          <Badge variant={descScore === "good" ? "default" : descScore === "ok" ? "secondary" : "destructive"}>
            {descLength} chars {descScore === "good" ? "(Perfect)" : descScore === "ok" ? "(OK)" : "(Fix)"}
          </Badge>
        </div>
      </div>

      {/* Recommendations */}
      {(titleScore !== "good" || descScore !== "good") && (
        <div className="mt-4 p-3 bg-muted rounded-md text-sm">
          <p className="font-semibold mb-2">Recommendations:</p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            {titleScore !== "good" && <li>Aim for 50-60 characters in title</li>}
            {descScore !== "good" && <li>Aim for 150-160 characters in description</li>}
          </ul>
        </div>
      )}
    </Card>
  )
}
