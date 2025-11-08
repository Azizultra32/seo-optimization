"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, AlertCircle, TrendingUp, Eye, MousePointerClick } from "lucide-react"

interface Recommendation {
  id: number
  url: string
  meta_title: string
  meta_description: string
  schema: any
  confidence: number
  created_at: string
}

interface Metrics {
  clicks: number
  impressions: number
  ctr: number
}

export default function SEOAdminPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isAuditing, setIsAuditing] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    loadRecommendations()
    loadMetrics()
  }, [])

  const loadRecommendations = async () => {
    try {
      const response = await fetch("/api/seo/analyze?url=/")
      const data = await response.json()
      if (data.recommendation) {
        setRecommendations([data.recommendation])
      }
    } catch (error) {
      console.error("[v0] Error loading recommendations:", error)
    }
  }

  const loadMetrics = async () => {
    try {
      const response = await fetch("/api/seo/metrics?url=/&days=30")
      const data = await response.json()
      if (data.success) {
        setMetrics(data)
      }
    } catch (error) {
      console.error("[v0] Error loading metrics:", error)
    }
  }

  const analyzeHomepage = async () => {
    setIsAnalyzing(true)
    setMessage(null)

    try {
      const response = await fetch("/api/seo/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: "/",
          content: `Dr. Ali Ghahary is a physician, entrepreneur, and thought leader reimagining healthcare on a global scale. 
          Board-certified general practitioner (CCFP) with over 20 years of clinical experience. 
          Founder of Armada MD healthcare technology platform. 
          Presented The KNGHT Doctrine at World Economic Forum Davos 2024.
          Products: Armada Housecall (telehealth), Armada AssistMD (AI clinical documentation), Armada ArkPass (patient data platform).`,
          currentMeta: {
            title: "Dr. Ali Ghahary - Healthcare Innovation",
            description:
              "Physician, entrepreneur, and thought leader reimagining healthcare through ethical AI and patient-centered technology.",
          },
        }),
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: "success", text: "SEO analysis completed successfully!" })
        loadRecommendations()
      } else {
        setMessage({ type: "error", text: data.error || "Analysis failed" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to analyze page" })
      console.error("[v0] Analysis error:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const runFullAudit = async () => {
    setIsAuditing(true)
    setMessage(null)

    try {
      const response = await fetch("/api/seo/audit", {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: "success", text: `Audit completed! Analyzed ${data.results.length} pages.` })
        loadRecommendations()
      } else {
        setMessage({ type: "error", text: data.error || "Audit failed" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to run audit" })
      console.error("[v0] Audit error:", error)
    } finally {
      setIsAuditing(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="font-ivyjournal text-4xl md:text-5xl text-black mb-2">SEO Dashboard</h1>
          <p className="font-alfabet text-black/60 text-base">
            AI-powered SEO analysis and recommendations for drghahary.com
          </p>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              message.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            <div className="flex items-center gap-2">
              {message.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <p className="font-alfabet text-sm">{message.text}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Button
            onClick={analyzeHomepage}
            disabled={isAnalyzing}
            className="h-auto py-4 flex flex-col items-start gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="font-alfabet text-sm">Analyzing...</span>
              </>
            ) : (
              <>
                <TrendingUp className="w-5 h-5" />
                <span className="font-alfabet text-sm font-normal">Analyze Homepage</span>
                <span className="font-alfabet text-xs font-light opacity-80">Get AI-powered SEO recommendations</span>
              </>
            )}
          </Button>

          <Button
            onClick={runFullAudit}
            disabled={isAuditing}
            variant="outline"
            className="h-auto py-4 flex flex-col items-start gap-2 bg-transparent"
          >
            {isAuditing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="font-alfabet text-sm">Auditing...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span className="font-alfabet text-sm font-normal">Run Full Site Audit</span>
                <span className="font-alfabet text-xs font-light opacity-80">Analyze all pages at once</span>
              </>
            )}
          </Button>
        </div>

        {/* Metrics Overview */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="font-alfabet text-sm font-normal flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Impressions (30d)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-alfabet text-3xl font-normal">{metrics.totals?.impressions || 0}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="font-alfabet text-sm font-normal flex items-center gap-2">
                  <MousePointerClick className="w-4 h-4" />
                  Clicks (30d)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-alfabet text-3xl font-normal">{metrics.totals?.clicks || 0}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="font-alfabet text-sm font-normal flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  CTR
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-alfabet text-3xl font-normal">{metrics.ctr?.toFixed(2) || 0}%</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recommendations */}
        <div className="space-y-6">
          <h2 className="font-alfabet text-xl font-normal text-black">AI Recommendations</h2>

          {recommendations.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="font-alfabet text-black/60 text-base mb-4">No recommendations yet</p>
                <p className="font-alfabet text-black/40 text-sm">
                  Click "Analyze Homepage" to generate AI-powered SEO recommendations
                </p>
              </CardContent>
            </Card>
          ) : (
            recommendations.map((rec) => (
              <Card key={rec.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="font-alfabet text-lg font-normal">{rec.url}</CardTitle>
                      <CardDescription className="font-alfabet text-sm">
                        Generated {new Date(rec.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge variant={rec.confidence > 0.8 ? "default" : "secondary"}>
                      {Math.round(rec.confidence * 100)}% confidence
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-alfabet text-sm font-normal text-black/60 mb-2">Recommended Title</h3>
                    <p className="font-alfabet text-base text-black">{rec.meta_title}</p>
                  </div>

                  <div>
                    <h3 className="font-alfabet text-sm font-normal text-black/60 mb-2">Recommended Description</h3>
                    <p className="font-alfabet text-base text-black">{rec.meta_description}</p>
                  </div>

                  {rec.schema && (
                    <div>
                      <h3 className="font-alfabet text-sm font-normal text-black/60 mb-2">Schema Recommendations</h3>
                      <pre className="font-mono text-xs bg-black/5 p-3 rounded overflow-x-auto">
                        {JSON.stringify(rec.schema, null, 2)}
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
