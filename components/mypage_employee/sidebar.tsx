"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  User,
  FileText,
  Calendar,
  Heart,
  Building,
  Target,
  Settings,
  Bell,
  CheckCircle2,
  Trophy,
  GraduationCap,
} from "lucide-react"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: "profile", label: "프로필", icon: User },
    { id: "skill-assessment", label: "숙련도 검사", icon: GraduationCap },
    { id: "challenges", label: "도전과제", icon: Trophy },
    { id: "todos", label: "TO DO LIST", icon: CheckCircle2 },
    { id: "applications", label: "지원 현황", icon: FileText },
    { id: "favorites", label: "관심 공고", icon: Heart },
    { id: "resume", label: "이력서 관리", icon: FileText },
    { id: "interviews", label: "면접 일정", icon: Calendar },
    { id: "companies", label: "관심 기업", icon: Building },
    { id: "goals", label: "취업 목표", icon: Target },
    { id: "settings", label: "설정", icon: Settings },
    { id: "notifications", label: "알림 설정", icon: Bell },
  ]

  return (
    <div className="lg:col-span-1">
      <Card className="bg-sidebar border-sidebar-border">
        <CardContent className="p-6">
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    activeTab === item.id ? "bg-primary text-black hover:bg-primary/90" : ""
                  }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              )
            })}
          </nav>
        </CardContent>
      </Card>
    </div>
  )
}
