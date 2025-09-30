import {
    User,
    ClipboardCheck,
    Target,
    CheckSquare,
    FileText,
    Building,
    Heart,
    MessageSquare,
    Calendar,
    Settings,
  } from "lucide-react"
  import type { MenuItem } from "@/types/mypage_employee"
  
  export const MENU_ITEMS: MenuItem[] = [
    {
      id: "profile",
      label: "프로필",
      icon: User,
      path: "/profile",
    },
    {
      id: "skill-assessment",
      label: "숙련도 검사",
      icon: ClipboardCheck,
      path: "/skill-assessment",
    },
    {
      id: "challenges",
      label: "도전과제",
      icon: Target,
      path: "/challenges",
    },
    {
      id: "todo",
      label: "TO DO LIST",
      icon: CheckSquare,
      path: "/todo",
    },
    {
      id: "resume",
      label: "이력서 관리",
      icon: FileText,
      path: "/resume",
    },
    {
      id: "applications",
      label: "지원 현황",
      icon: Building,
      path: "/applications",
    },
    {
      id: "favorites",
      label: "관심 기업",
      icon: Heart,
      path: "/favorites",
    },
    {
      id: "interviews",
      label: "면접 일정",
      icon: MessageSquare,
      path: "/interviews",
    },
    {
      id: "goals",
      label: "목표 설정",
      icon: Calendar,
      path: "/goals",
    },
    {
      id: "settings",
      label: "설정",
      icon: Settings,
      path: "/settings",
    },
  ]
  