"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { NavHeader } from "@/components/nav-header"
import { Download, Eye, Trash2, FileText, Clock } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import type { TeachingPlan } from "@/lib/actions"

interface SavedPlan {
  id: string
  title: string
  date: string
  plan: TeachingPlan
  fullPlan: string
}

export default function HistoryPage() {
  const router = useRouter()
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([])
  const [selectedPlan, setSelectedPlan] = useState<SavedPlan | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    loadSavedPlans()
  }, [])

  const loadSavedPlans = () => {
    try {
      const plansJson = localStorage.getItem("savedPlans")
      if (plansJson) {
        const plans = JSON.parse(plansJson)
        setSavedPlans(plans)
      }
    } catch (error) {
      console.error("加载保存的教案失败", error)
    }
  }

  const handleViewPlan = (plan: SavedPlan) => {
    setSelectedPlan(plan)
    setIsDialogOpen(true)
  }

  const handleDownload = (plan: SavedPlan) => {
    const blob = new Blob([plan.fullPlan], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${plan.title}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDelete = (id: string) => {
    const updatedPlans = savedPlans.filter((plan) => plan.id !== id)
    setSavedPlans(updatedPlans)
    localStorage.setItem("savedPlans", JSON.stringify(updatedPlans))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <>
      <NavHeader />
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-6">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">历史教案</h1>
            <p className="text-gray-600 mb-8">查看和管理您之前生成的教案</p>

            {savedPlans.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">暂无保存的教案</h2>
                <p className="text-gray-600 mb-6">您还没有生成和保存任何教案。返回首页创建您的第一个教案吧！</p>
                <Button onClick={() => router.push("/")} className="bg-blue-600 hover:bg-blue-700">
                  创建新教案
                </Button>
              </div>
            ) : (
              <div className="grid gap-6">
                {savedPlans.map((plan) => (
                  <Card key={plan.id} className="border-blue-100 shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">{plan.title}</CardTitle>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{formatDate(plan.date)}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="text-sm text-gray-600">
                        <div className="font-medium mb-1">教学目标：</div>
                        <ul className="list-disc list-inside pl-1 space-y-1">
                          {plan.plan.objectives.slice(0, 2).map((obj, i) => (
                            <li key={i}>{obj}</li>
                          ))}
                          {plan.plan.objectives.length > 2 && <li>...</li>}
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 pt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(plan.id)}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        删除
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleViewPlan(plan)}>
                        <Eye className="h-4 w-4 mr-1" />
                        查看
                      </Button>
                      <Button size="sm" onClick={() => handleDownload(plan)} className="bg-blue-600 hover:bg-blue-700">
                        <Download className="h-4 w-4 mr-1" />
                        下载
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{selectedPlan?.title}</DialogTitle>
            <DialogDescription>创建于 {selectedPlan ? formatDate(selectedPlan.date) : ""}</DialogDescription>
          </DialogHeader>

          <div className="overflow-auto flex-1 my-4">
            <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md text-sm border border-gray-200">
              {selectedPlan?.fullPlan}
            </pre>
          </div>

          <DialogFooter>
            <Button
              onClick={() => selectedPlan && handleDownload(selectedPlan)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Download className="h-4 w-4 mr-2" />
              下载教案
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

