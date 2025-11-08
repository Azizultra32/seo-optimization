"use client"

import * as React from "react"
import { Command } from "cmdk"
import { Search, FileText, BarChart3, Zap, Settings, Moon, Sun, PenTool } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Dialog, DialogContent } from "@/components/ui/dialog"

export function CommandBar() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const { setTheme, theme } = useTheme()

  // ⌘K to open
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-12 px-4 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all flex items-center gap-2 group animate-fluid"
      >
        <Search className="w-4 h-4" />
        <span className="text-sm font-medium">Press ⌘K</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 max-w-2xl">
          <Command className="rounded-lg border shadow-md">
            <Command.Input placeholder="Type a command or search..." className="border-0 focus:ring-0 px-4 py-3" />
            <Command.List className="max-h-[400px] overflow-y-auto p-2">
              <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                No results found.
              </Command.Empty>

              <Command.Group heading="SEO" className="text-xs text-muted-foreground px-2 py-1">
                <Command.Item
                  onSelect={() => runCommand(() => router.push("/admin/seo"))}
                  className="flex items-center gap-3 px-4 py-3 rounded-md cursor-pointer hover:bg-accent"
                >
                  <Zap className="w-4 h-4" />
                  <span>Open SEO Dashboard</span>
                </Command.Item>
                <Command.Item
                  onSelect={() =>
                    runCommand(async () => {
                      await fetch("/api/seo/analyze", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ url: window.location.pathname }),
                      })
                      alert("SEO analysis started for current page")
                    })
                  }
                  className="flex items-center gap-3 px-4 py-3 rounded-md cursor-pointer hover:bg-accent"
                >
                  <Zap className="w-4 h-4" />
                  <span>Generate SEO Recommendations</span>
                </Command.Item>
              </Command.Group>

              <Command.Group heading="Content" className="text-xs text-muted-foreground px-2 py-1">
                <Command.Item
                  onSelect={() => runCommand(() => router.push("/admin/content"))}
                  className="flex items-center gap-3 px-4 py-3 rounded-md cursor-pointer hover:bg-accent"
                >
                  <FileText className="w-4 h-4" />
                  <span>Open Content Dashboard</span>
                </Command.Item>
                <Command.Item
                  onSelect={() =>
                    runCommand(async () => {
                      await fetch("/api/content/generate", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ contentType: "blog_post" }),
                      })
                      alert("Content generation started")
                    })
                  }
                  className="flex items-center gap-3 px-4 py-3 rounded-md cursor-pointer hover:bg-accent"
                >
                  <PenTool className="w-4 h-4" />
                  <span>Create New Draft Post</span>
                </Command.Item>
              </Command.Group>

              <Command.Group heading="Analytics" className="text-xs text-muted-foreground px-2 py-1">
                <Command.Item
                  onSelect={() => runCommand(() => router.push("/admin/analytics"))}
                  className="flex items-center gap-3 px-4 py-3 rounded-md cursor-pointer hover:bg-accent"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Open Analytics Dashboard</span>
                </Command.Item>
              </Command.Group>

              <Command.Group heading="Settings" className="text-xs text-muted-foreground px-2 py-1">
                <Command.Item
                  onSelect={() => runCommand(() => setTheme(theme === "dark" ? "light" : "dark"))}
                  className="flex items-center gap-3 px-4 py-3 rounded-md cursor-pointer hover:bg-accent"
                >
                  {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span>Toggle Theme</span>
                </Command.Item>
                <Command.Item
                  onSelect={() => runCommand(() => router.push("/privacy"))}
                  className="flex items-center gap-3 px-4 py-3 rounded-md cursor-pointer hover:bg-accent"
                >
                  <Settings className="w-4 h-4" />
                  <span>Privacy Policy</span>
                </Command.Item>
              </Command.Group>
            </Command.List>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  )
}
