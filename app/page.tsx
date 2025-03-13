import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UploadForm } from "@/components/upload-form"
import { PasteForm } from "@/components/paste-form"
import { NavHeader } from "@/components/nav-header"
import { BookOpen } from "lucide-react"

export default function Home() {
  return (
    <>
      <NavHeader />
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-4">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-3">小学教师教案生成助手</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              轻松上传或粘贴讲义内容，快速生成专业教案，提高教学效率
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                <h2 className="text-xl font-semibold mb-2">第一步：上传或粘贴讲义内容</h2>
                <p className="text-blue-100">
                  请上传您的讲义文件或直接粘贴讲义内容，系统将自动生成教学目标、教学重点、教学准备和课程安排。
                </p>
              </div>

              <div className="p-6">
                <Tabs defaultValue="upload" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="upload">上传文件</TabsTrigger>
                    <TabsTrigger value="paste">粘贴内容</TabsTrigger>
                  </TabsList>
                  <TabsContent value="upload">
                    <UploadForm />
                  </TabsContent>
                  <TabsContent value="paste">
                    <PasteForm />
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-blue-600 font-bold text-xl">1</span>
                </div>
                <h3 className="font-medium text-gray-800 mb-2">上传或粘贴讲义</h3>
                <p className="text-gray-600 text-sm">简单上传文件或粘贴讲义内容，快速开始教案生成</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-blue-600 font-bold text-xl">2</span>
                </div>
                <h3 className="font-medium text-gray-800 mb-2">编辑教案内容</h3>
                <p className="text-gray-600 text-sm">根据您的需求修改生成的教学目标、重点和课程安排</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-blue-600 font-bold text-xl">3</span>
                </div>
                <h3 className="font-medium text-gray-800 mb-2">生成完整教案</h3>
                <p className="text-gray-600 text-sm">一键生成专业教案，并可下载保存，方便教学使用</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

