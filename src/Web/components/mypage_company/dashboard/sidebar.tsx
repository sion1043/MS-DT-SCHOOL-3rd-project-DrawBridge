"use client"

import { Button } from "@/components/ui/button"
import { User, FileText, Users, Calendar, BarChart3, Settings, Bell } from "lucide-react"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: "profile", label: "프로필", icon: User },
    { id: "jobs", label: "공고 관리", icon: FileText },
    { id: "applicants", label: "지원자 관리", icon: Users },
    { id: "interviews", label: "면접 일정", icon: Calendar },
    { id: "analytics", label: "채용 분석", icon: BarChart3 },
    { id: "settings", label: "설정", icon: Settings },
    { id: "notifications", label: "알림 설정", icon: Bell },
  ]

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-4">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`w-full justify-start h-12 px-4 ${
                  isActive ? "bg-yellow-400 text-black hover:bg-yellow-400" : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
              </Button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
