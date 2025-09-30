import type React from "react"

// User Profile Types
export interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  position: string
  location: string
  avatar: string
}

// Skill Assessment Types
export interface SkillStack {
  name: string
  score: number
  lastTested: string
}

export type SkillCategory =
  | "프론트엔드"
  | "백엔드"
  | "데이터베이스"
  | "도구"
  | "클라우드"
  | "모바일"
  | "데이터 사이언스"
  | "게임 개발"
  | "블록체인"
  | "보안"
  | "기타"

export type AssessmentStep = "results" | "skillSearch" | "guidelines" | "test" | "completed"

export type SortOption = "score-desc" | "score-asc" | "name" | "date"

// Application Types
export interface JobApplication {
  id: string
  company: string
  position: string
  status: ApplicationStatus
  date: string
  statusColor: string
  textColor: string
}

export type ApplicationStatus = "서류 심사 중" | "면접 예정" | "최종 합격" | "불합격" | "지원 완료"

// Challenge Types
export interface Challenge {
  id: string
  title: string
  description: string
  difficulty: ChallengeDifficulty
  category: string
  progress: number
  isCompleted: boolean
  dueDate?: string
  reward?: string
}

export type ChallengeDifficulty = "초급" | "중급" | "고급"

// Todo Types
export interface TodoItem {
  id: string
  title: string
  description?: string
  isCompleted: boolean
  priority: TodoPriority
  category: string
  dueDate?: string
  createdAt: string
}

export type TodoPriority = "높음" | "보통" | "낮음"

// Common UI Types
export interface FilterOption {
  value: string
  label: string
}

export interface SortConfig {
  key: string
  direction: "asc" | "desc"
}

// API Response Types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  error?: string
}

// Form Types
export interface FormField {
  name: string
  label: string
  type: "text" | "email" | "tel" | "textarea" | "select"
  required?: boolean
  placeholder?: string
  options?: FilterOption[]
}

// Navigation Types
export interface MenuItem {
  id: string
  label: string
  icon: React.ComponentType<any>
  path: string
  isActive?: boolean
}

// Statistics Types
export interface StatCard {
  title: string
  value: string | number
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
}
