"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, History, Home } from "lucide-react"
import { cn } from "@/lib/utils"

export function NavHeader() {
  const pathname = usePathname()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
            <span className="font-bold text-xl text-gray-800">教案助手</span>
          </div>

          <nav className="flex space-x-1">
            <Link
              href="/"
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium flex items-center",
                pathname === "/" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              <Home className="h-4 w-4 mr-1.5" />
              首页
            </Link>
            <Link
              href="/history"
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium flex items-center",
                pathname === "/history"
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              <History className="h-4 w-4 mr-1.5" />
              历史记录
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

