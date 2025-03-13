"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Download, Loader2, FileText, Save, CheckCircle2 } from "lucide-react"
import { type TeachingPlan, generateFullPlan } from "@/lib/actions"
import { NavHeader } from "@/components/nav-header"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function GeneratePage() {
  const router = useRouter()
  const [plan, setPlan] = useState<TeachingPlan | null>(null)
  const [fullPlan, setFullPlan] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("我的教案")
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // 从localStorage获取编辑后的计划
    const storedPlan = localStorage.getItem("editedPlan")
    if (storedPlan) {
      const parsedPlan = JSON.parse(storedPlan)
      setPlan(parsedPlan)
      generatePlan(parsedPlan)
    } else {
      // 如果没有数据，返回首页
      router.push("/")
    }
  }, [router])

  const generatePlan = async (planData: TeachingPlan) => {
    setLoading(true)
    try {
      const result = await generateFullPlan(planData)
      setFullPlan(result)
    } catch (error) {
      console.error("生成教案失败", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([fullPlan], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${title}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleSave = () => {
    if (!plan) return

    try {
      // 创建要保存的教案对象
      const savedPlan = {
        id: Date.now().toString(),
        title: title,
        date: new Date().toISOString(),
        plan: plan,
        fullPlan: fullPlan,
      }

      // 获取现有的保存教案
      let savedPlans = []
      const savedPlansJson = localStorage.getItem("savedPlans")
      if (savedPlansJson) {
        savedPlans = JSON.parse(savedPlansJson)
      }

      // 添加新教案并保存
      savedPlans.unshift(savedPlan)
      localStorage.setItem("savedPlans", JSON.stringify(savedPlans))

      // 显示保存成功提示
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error("保存教案失败", error)
    }
  }

  if (loading) {
    return (
      <>
        <NavHeader />
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center">
          <Loader2 className="h-16 w-16 animate-spin mb-6 text-blue-600" />
          <p className="text-xl text-gray-700 mb-2">正在生成完整教案</p>
          <p className="text-gray-500">请稍候，这可能需要几秒钟...</p>
        </div>
      </>
    )
  }

  return (
    <>
      <NavHeader />
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-8">
              <Button variant="outline" size="sm" onClick={() => router.push("/edit")} className="mr-4 bg-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回编辑
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">完整教案</h1>
                <p className="text-gray-600 mt-1">您可以查看、保存和下载生成的完整教案</p>
              </div>
            </div>

            <div className="mb-6">
              <Label htmlFor="title" className="text-base font-medium text-gray-700 mb-2 block">
                教案标题
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="输入教案标题"
                className="max-w-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <Card className="mb-8 border-blue-100 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                <h2 className="font-semibold">教案预览</h2>
              </div>
              <CardContent className="p-0">
                <div className="prose max-w-none p-6">
                  <pre className="whitespace-pre-wrap bg-gray-50 p-6 rounded-md text-sm border border-gray-200 overflow-auto max-h-[70vh]">
                    {fullPlan}
                  </pre>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" onClick={handleSave} className="bg-white">
                <Save className="mr-2 h-5 w-5" />
                保存教案
              </Button>
              <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700 h-12 px-6 text-base">
                <Download className="mr-2 h-5 w-5" />
                下载教案
              </Button>
            </div>

            {saved && (
              <Alert className="mt-4 bg-green-50 border-green-200 text-green-700">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>教案已成功保存！您可以在"历史记录"中查看。</AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </main>
    </>
  )
}

