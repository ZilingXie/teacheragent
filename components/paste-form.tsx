"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { FileText, Loader2, AlertCircle } from "lucide-react"
import { generateInitialPlan } from "@/lib/actions"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function PasteForm() {
  const router = useRouter()
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) {
      setError("请输入讲义内容")
      return
    }

    setLoading(true)
    try {
      const result = await generateInitialPlan(content)

      // Store the result in localStorage to pass to the next page
      localStorage.setItem("initialPlan", JSON.stringify(result))

      // Navigate to the edit page
      router.push("/edit")
    } catch (err) {
      setError("处理内容时出错，请重试")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="content" className="text-base font-medium text-gray-700 mb-2 block">
            粘贴讲义内容
          </Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="在此粘贴您的讲义内容..."
            className="min-h-[240px] text-base resize-y border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      <Button type="submit" className="w-full h-12 text-base font-medium" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            处理中...
          </>
        ) : (
          <>
            <FileText className="mr-2 h-5 w-5" />
            生成教案
          </>
        )}
      </Button>
    </form>
  )
}

