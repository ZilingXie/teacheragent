"use server"

import { revalidatePath } from "next/cache"

export interface TeachingPlan {
  objectives: string[]
  keyPoints: string[]
  preparation: string[]
  schedule: ScheduleItem[]
  content?: string
}

export interface ScheduleItem {
  stage: string
  duration: string
  activities: string
}

// 模拟AI生成教案内容
export async function generateInitialPlan(content: string): Promise<TeachingPlan> {
  // 在实际应用中，这里会调用AI服务来分析内容并生成教案
  // 这里我们使用模拟数据

  // 等待1秒模拟处理时间
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    objectives: ["理解加法的基本概念", "掌握10以内的加法运算", "培养学生的数学思维能力"],
    keyPoints: ["加法的概念和符号", "10以内加法的计算方法", "加法的应用场景"],
    preparation: ["数字卡片", "计数器具", "教学课件", "练习题"],
    schedule: [
      {
        stage: "导入",
        duration: "5分钟",
        activities: "通过生活中的例子引入加法概念，激发学生学习兴趣。",
      },
      {
        stage: "新课讲解",
        duration: "15分钟",
        activities: "讲解加法的概念和符号，展示10以内加法的计算方法。",
      },
      {
        stage: "练习巩固",
        duration: "15分钟",
        activities: "学生进行10以内加法练习，教师巡视指导。",
      },
      {
        stage: "总结",
        duration: "5分钟",
        activities: "总结本节课学习内容，布置家庭作业。",
      },
    ],
    content: content,
  }
}

// 生成完整教案
export async function generateFullPlan(plan: TeachingPlan): Promise<string> {
  // 在实际应用中，这里会调用AI服务来生成完整教案
  // 这里我们使用模拟数据

  // 等待1秒模拟处理时间
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const objectives = plan.objectives.map((obj) => `- ${obj}`).join("\n")
  const keyPoints = plan.keyPoints.map((point) => `- ${point}`).join("\n")
  const preparation = plan.preparation.map((item) => `- ${item}`).join("\n")

  const scheduleItems = plan.schedule
    .map((item) => `### ${item.stage}（${item.duration}）\n${item.activities}`)
    .join("\n\n")

  return `# 教学计划

## 教学目标
${objectives}

## 教学重点
${keyPoints}

## 教学准备
${preparation}

## 教学过程
${scheduleItems}

## 板书设计
- 加法概念：把两部分合并在一起
- 加法符号：+
- 加法算式：a + b = c

## 教学反思
本节课通过生活实例引入加法概念，学生理解较好。在练习环节，部分学生计算速度较慢，需要加强训练。下次课可以增加更多互动环节，提高学生参与度。
`
}

// 保存修改后的教案
export async function saveEditedPlan(plan: TeachingPlan) {
  // 在实际应用中，这里会将数据保存到数据库
  // 这里我们只是模拟保存过程

  // 等待500毫秒模拟保存时间
  await new Promise((resolve) => setTimeout(resolve, 500))

  // 重新验证路径，确保数据刷新
  revalidatePath("/edit")
  revalidatePath("/generate")

  return { success: true }
}

