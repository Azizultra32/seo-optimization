"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Plus, CheckCircle, XCircle, Eye } from "lucide-react"
import { SEOSnippetCard } from "@/components/seo-snippet-card"

type ContentType = "blog" | "case_study" | "press_release" | "product_update"
type ContentStatus = "draft" | "review" | "approved" | "published" | "archived"

interface ContentDraft {
  id: number
  type: ContentType
  title: string
  slug: string
  content: string
  excerpt: string
  status: ContentStatus
  keywords: string[]
  internal_links: string[]
  created_at: string
  published_at?: string
}

export default function ContentManagementPage() {
  const [drafts, setDrafts] = useState<ContentDraft[]>([])
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [selectedDraft, setSelectedDraft] = useState<ContentDraft | null>(null)
  const [activeTab, setActiveTab] = useState<ContentStatus>("draft")

  // Generation form state
  const [contentType, setContentType] = useState<ContentType>("blog")
  const [topic, setTopic] = useState("")
  const [customPrompt, setCustomPrompt] = useState("")

  useEffect(() => {
    fetchDrafts()
  }, [activeTab])

  const fetchDrafts = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/content/drafts?status=${activeTab}`)
      const data = await res.json()
      setDrafts(data.drafts || [])
    } catch (error) {
      console.error("Failed to fetch drafts:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateContent = async () => {
    if (!topic) return

    setGenerating(true)
    try {
      const res = await fetch("/api/content/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: contentType,
          topic,
          customPrompt: customPrompt || undefined,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setTopic("")
        setCustomPrompt("")
        fetchDrafts()
        setSelectedDraft(data.draft)
      }
    } catch (error) {
      console.error("Failed to generate content:", error)
    } finally {
      setGenerating(false)
    }
  }

  const updateDraftStatus = async (id: number, newStatus: ContentStatus) => {
    try {
      const res = await fetch("/api/content/drafts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      })

      if (res.ok) {
        fetchDrafts()
        if (selectedDraft?.id === id) {
          setSelectedDraft({ ...selectedDraft, status: newStatus })
        }
      }
    } catch (error) {
      console.error("Failed to update status:", error)
    }
  }

  const StatusBadge = ({ status }: { status: ContentStatus }) => {
    const colors = {
      draft: "bg-gray-500",
      review: "bg-blue-500",
      approved: "bg-green-500",
      published: "bg-purple-500",
      archived: "bg-red-500",
    }
    return <Badge className={colors[status]}>{status}</Badge>
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">AI Content Generation</h1>

        {/* Generation Form */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Generate New Content</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Content Type</label>
                <Select value={contentType} onValueChange={(v) => setContentType(v as ContentType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blog">Blog Post</SelectItem>
                    <SelectItem value="case_study">Case Study</SelectItem>
                    <SelectItem value="press_release">Press Release</SelectItem>
                    <SelectItem value="product_update">Product Update</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Topic</label>
                <Input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., AI-powered clinical documentation"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Custom Prompt (optional)</label>
              <Textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Leave empty to use default template..."
                rows={3}
              />
            </div>

            <Button onClick={generateContent} disabled={!topic || generating} className="w-full">
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Generate Content
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Content Management */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ContentStatus)}>
          <TabsList>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="review">Review</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
              </div>
            ) : drafts.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-gray-500">No {activeTab} content found</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Draft List */}
                <div className="space-y-4">
                  {drafts.map((draft) => (
                    <Card
                      key={draft.id}
                      className={`p-4 cursor-pointer hover:shadow-lg transition-shadow ${
                        selectedDraft?.id === draft.id ? "ring-2 ring-blue-500" : ""
                      }`}
                      onClick={() => setSelectedDraft(draft)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg">{draft.title}</h3>
                        <StatusBadge status={draft.status} />
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{draft.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="capitalize">{draft.type.replace("_", " ")}</span>
                        <span>{new Date(draft.created_at).toLocaleDateString()}</span>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Draft Preview */}
                {selectedDraft && (
                  <Card className="p-6 sticky top-8">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold">{selectedDraft.title}</h2>
                      <StatusBadge status={selectedDraft.status} />
                    </div>

                    <div className="mb-6">
                      <SEOSnippetCard
                        title={selectedDraft.title}
                        description={selectedDraft.excerpt}
                        url={`https://drghahary.com/blog/${selectedDraft.slug}`}
                      />
                    </div>

                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Slug</label>
                        <p className="text-sm">{selectedDraft.slug}</p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-500">Excerpt</label>
                        <p className="text-sm">{selectedDraft.excerpt}</p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-500">Keywords</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedDraft.keywords.map((keyword, i) => (
                            <Badge key={i} variant="outline">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-500">Internal Links</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedDraft.internal_links.map((link, i) => (
                            <Badge key={i} variant="outline">
                              {link}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-500">Content</label>
                        <div className="mt-2 p-4 bg-gray-50 rounded-lg max-h-96 overflow-y-auto">
                          <pre className="whitespace-pre-wrap text-sm">{selectedDraft.content}</pre>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {selectedDraft.status === "draft" && (
                        <Button onClick={() => updateDraftStatus(selectedDraft.id, "review")} className="flex-1">
                          <Eye className="mr-2 h-4 w-4" />
                          Send to Review
                        </Button>
                      )}
                      {selectedDraft.status === "review" && (
                        <>
                          <Button
                            onClick={() => updateDraftStatus(selectedDraft.id, "approved")}
                            className="flex-1"
                            variant="default"
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => updateDraftStatus(selectedDraft.id, "draft")}
                            variant="outline"
                            className="flex-1"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject
                          </Button>
                        </>
                      )}
                      {selectedDraft.status === "approved" && (
                        <Button onClick={() => updateDraftStatus(selectedDraft.id, "published")} className="flex-1">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Publish
                        </Button>
                      )}
                    </div>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
