// Re-export all constants for easy importing
export * from "./skills"
export * from "./navigation"
export * from "./application-status"
export * from "./todo"
export * from "./challenges"
export * from "./form-fields"
export * from "./ui"

// App-wide constants
export const APP_NAME = "구직자 마이페이지"
export const APP_VERSION = "1.0.0"
export const APP_DESCRIPTION = "구직자를 위한 종합 관리 플랫폼"

export const LOCAL_STORAGE_KEYS = {
  SKILLS: "mypage-skills",
  TODOS: "mypage-todos",
  APPLICATIONS: "mypage-applications",
  PROFILE: "mypage-profile",
  SETTINGS: "mypage-settings",
} as const

export const API_ENDPOINTS = {
  PROFILE: "/api/profile",
  SKILLS: "/api/skills",
  APPLICATIONS: "/api/applications",
  TODOS: "/api/todos",
} as const

export const DATE_FORMATS = {
  SHORT: "YYYY.MM.DD",
  LONG: "YYYY년 MM월 DD일",
  ISO: "YYYY-MM-DD",
} as const
