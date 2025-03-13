"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, Loader2, AlertCircle } from "lucide-react"
import { generateInitialPlan } from "@/lib/actions"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function UploadForm() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (
        selectedFile.type === "text/plain" ||
        selectedFile.type === "application/msword" ||
        selectedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setFile(selectedFile)
        setError("")
      } else {
        setError("请上传文本文件或Word文档")
        setFile(null)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError("请选择文件")
      return
    }

    setLoading(true)
    try {
      const text = await readFileAsText(file)
      const result = await generateInitialPlan(text)

      // Store the result in localStorage to pass to the next page
      localStorage.setItem("initialPlan", JSON.stringify(result))

      // Navigate to the edit page
      router.push("/edit")
    } catch (err) {
      setError("处理文件时出错，请重试")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = (e) => reject(e)
      reader.readAsText(file)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
          <Label htmlFor="file" className="flex flex-col items-center cursor-pointer">
            <Upload className="h-10 w-10 text-blue-500 mb-2" />
            <span className="text-lg font-medium text-gray-700 mb-1">选择讲义文件</span>
            <span className="text-sm text-gray-500">支持 .txt, .doc, .docx 格式</span>
            <Input id="file" type="file" accept=".txt,.doc,.docx" onChange={handleFileChange} className="hidden" />
          </Label>
        </div>

        {file && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg text-blue-700">
            <FileText size={20} />
            <span className="font-medium">{file.name}</span>
          </div>
        )}

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
            <Upload className="mr-2 h-5 w-5" />
            上传并生成教案
          </>
        )}
      </Button>
    </form>
  )
}

