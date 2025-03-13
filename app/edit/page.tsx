"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Save, FileOutput, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react"
import { type TeachingPlan, type ScheduleItem, saveEditedPlan } from "@/lib/actions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { NavHeader } from "@/components/nav-header"

// 其余代码保持不变...

export default function EditPage() {
  const router = useRouter()
  const [plan, setPlan] = useState<TeachingPlan | null>(null)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // 从localStorage获取初始计划
    const storedPlan = localStorage.getItem("initialPlan")
    if (storedPlan) {
      setPlan(JSON.parse(storedPlan))
    } else {
      // 如果没有数据，返回首页
      router.push("/")
    }
  }, [router])

  const handleObjectiveChange = (index: number, value: string) => {
    if (!plan) return
    const newObjectives = [...plan.objectives]
    newObjectives[index] = value
    setPlan({ ...plan, objectives: newObjectives })
    setSaved(false)
  }

  const handleKeyPointChange = (index: number, value: string) => {
    if (!plan) return
    const newKeyPoints = [...plan.keyPoints]
    newKeyPoints[index] = value
    setPlan({ ...plan, keyPoints: newKeyPoints })
    setSaved(false)
  }

  const handlePreparationChange = (index: number, value: string) => {
    if (!plan) return
    const newPreparation = [...plan.preparation]
    newPreparation[index] = value
    setPlan({ ...plan, preparation: newPreparation })
    setSaved(false)
  }

  const handleScheduleChange = (index: number, field: keyof ScheduleItem, value: string) => {
    if (!plan) return
    const newSchedule = [...plan.schedule]
    newSchedule[index] = { ...newSchedule[index], [field]: value }
    setPlan({ ...plan, schedule: newSchedule })
    setSaved(false)
  }

  const addObjective = () => {
    if (!plan) return
    setPlan({ ...plan, objectives: [...plan.objectives, ""] })
    setSaved(false)
  }

  const removeObjective = (index: number) => {
    if (!plan) return
    const newObjectives = [...plan.objectives]
    newObjectives.splice(index, 1)
    setPlan({ ...plan, objectives: newObjectives })
    setSaved(false)
  }

  const addKeyPoint = () => {
    if (!plan) return
    setPlan({ ...plan, keyPoints: [...plan.keyPoints, ""] })
    setSaved(false)
  }

  const removeKeyPoint = (index: number) => {
    if (!plan) return
    const newKeyPoints = [...plan.keyPoints]
    newKeyPoints.splice(index, 1)
    setPlan({ ...plan, keyPoints: newKeyPoints })
    setSaved(false)
  }

  const addPreparation = () => {
    if (!plan) return
    setPlan({ ...plan, preparation: [...plan.preparation, ""] })
    setSaved(false)
  }

  const removePreparation = (index: number) => {
    if (!plan) return
    const newPreparation = [...plan.preparation]
    newPreparation.splice(index, 1)
    setPlan({ ...plan, preparation: newPreparation })
    setSaved(false)
  }

  const addScheduleItem = () => {
    if (!plan) return
    const newItem: ScheduleItem = {
      stage: "",
      duration: "",
      activities: "",
    }
    setPlan({ ...plan, schedule: [...plan.schedule, newItem] })
    setSaved(false)
  }

  const removeScheduleItem = (index: number) => {
    if (!plan) return
    const newSchedule = [...plan.schedule]
    newSchedule.splice(index, 1)
    setPlan({ ...plan, schedule: newSchedule })
    setSaved(false)
  }

  const handleSave = async () => {
    if (!plan) return
    setLoading(true)
    try {
      await saveEditedPlan(plan)
      localStorage.setItem("editedPlan", JSON.stringify(plan))
      setSaved(true)

      // 3秒后自动隐藏成功消息
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error("保存失败", error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = () => {
    if (!plan) return
    localStorage.setItem("editedPlan", JSON.stringify(plan))
    router.push("/generate")
  }

  if (!plan) {
    return (
      <>
        <NavHeader />
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex justify-center items-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-lg text-gray-700">加载中，请稍候...</p>
          </div>
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
              <Button variant="outline" size="sm" onClick={() => router.push("/")} className="mr-4 bg-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">编辑教案内容</h1>
                <p className="text-gray-600 mt-1">根据您的需求修改生成的教案内容</p>
              </div>
            </div>

            <div className="grid gap-8 mb-8">
              <Card className="border-blue-100 shadow-md">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <CardTitle>教学目标</CardTitle>
                  <CardDescription className="text-blue-100">
                    明确本节课的教学目标，帮助学生掌握核心知识点
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {plan.objectives.map((objective, index) => (
                      <div key={`objective-${index}`} className="flex items-center gap-3 group">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">
                          {index + 1}
                        </div>
                        <Input
                          value={objective}
                          onChange={(e) => handleObjectiveChange(index, e.target.value)}
                          placeholder="输入教学目标"
                          className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeObjective(index)}
                          disabled={plan.objectives.length <= 1}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={addObjective}
                      className="w-full border-dashed border-gray-300 text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      添加教学目标
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-100 shadow-md">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <CardTitle>教学重点</CardTitle>
                  <CardDescription className="text-blue-100">确定本节课的教学重点，突出关键知识点</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {plan.keyPoints.map((keyPoint, index) => (
                      <div key={`keyPoint-${index}`} className="flex items-center gap-3 group">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">
                          {index + 1}
                        </div>
                        <Input
                          value={keyPoint}
                          onChange={(e) => handleKeyPointChange(index, e.target.value)}
                          placeholder="输入教学重点"
                          className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeKeyPoint(index)}
                          disabled={plan.keyPoints.length <= 1}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={addKeyPoint}
                      className="w-full border-dashed border-gray-300 text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      添加教学重点
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-100 shadow-md">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <CardTitle>教学准备</CardTitle>
                  <CardDescription className="text-blue-100">列出本节课需要的教学材料和工具</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {plan.preparation.map((item, index) => (
                      <div key={`preparation-${index}`} className="flex items-center gap-3 group">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">
                          {index + 1}
                        </div>
                        <Input
                          value={item}
                          onChange={(e) => handlePreparationChange(index, e.target.value)}
                          placeholder="输入教学准备"
                          className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removePreparation(index)}
                          disabled={plan.preparation.length <= 1}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={addPreparation}
                      className="w-full border-dashed border-gray-300 text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      添加教学准备
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-100 shadow-md">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <CardTitle>课程安排</CardTitle>
                  <CardDescription className="text-blue-100">规划本节课的教学流程和时间分配</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {plan.schedule.map((item, index) => (
                      <div
                        key={`schedule-${index}`}
                        className="p-5 border border-gray-200 rounded-lg space-y-4 hover:border-blue-200 hover:bg-blue-50/30 transition-colors group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                              {index + 1}
                            </div>
                            <h3 className="font-medium text-gray-800">教学环节</h3>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeScheduleItem(index)}
                            disabled={plan.schedule.length <= 1}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label
                              htmlFor={`stage-${index}`}
                              className="text-sm font-medium text-gray-700 mb-1.5 block"
                            >
                              环节名称
                            </Label>
                            <Input
                              id={`stage-${index}`}
                              value={item.stage}
                              onChange={(e) => handleScheduleChange(index, "stage", e.target.value)}
                              placeholder="如：导入、讲解、练习等"
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <Label
                              htmlFor={`duration-${index}`}
                              className="text-sm font-medium text-gray-700 mb-1.5 block"
                            >
                              时长
                            </Label>
                            <Input
                              id={`duration-${index}`}
                              value={item.duration}
                              onChange={(e) => handleScheduleChange(index, "duration", e.target.value)}
                              placeholder="如：5分钟、10分钟等"
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <div>
                          <Label
                            htmlFor={`activities-${index}`}
                            className="text-sm font-medium text-gray-700 mb-1.5 block"
                          >
                            活动内容
                          </Label>
                          <Textarea
                            id={`activities-${index}`}
                            value={item.activities}
                            onChange={(e) => handleScheduleChange(index, "activities", e.target.value)}
                            placeholder="描述该环节的教学活动内容"
                            rows={3}
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={addScheduleItem}
                      className="w-full border-dashed border-gray-300 text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      添加课程环节
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button variant="outline" onClick={handleSave} disabled={loading} className="bg-white">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    保存修改
                  </>
                )}
              </Button>
              <Button onClick={handleGenerate} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                <FileOutput className="mr-2 h-4 w-4" />
                生成完整教案
              </Button>
            </div>

            {saved && (
              <Alert className="mt-4 bg-green-50 border-green-200 text-green-700">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>修改已保存成功！</AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </main>
    </>
  )
}

