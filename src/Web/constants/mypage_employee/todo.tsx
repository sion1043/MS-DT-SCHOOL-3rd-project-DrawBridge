import type { TodoPriority } from "@/types/mypage_employee"

export const TODO_PRIORITIES: TodoPriority[] = ["높음", "보통", "낮음"]

export const TODO_PRIORITY_COLORS: Record<TodoPriority, string> = {
  높음: "text-red-600",
  보통: "text-yellow-600",
  낮음: "text-green-600",
}

export const TODO_CATEGORIES = ["이력서", "포트폴리오", "네트워킹", "스킬 개발", "면접 준비", "기타"]

export const TODO_PRIORITY_OPTIONS = TODO_PRIORITIES.map((priority) => ({
  value: priority,
  label: priority,
}))

export const TODO_CATEGORY_OPTIONS = TODO_CATEGORIES.map((category) => ({
  value: category,
  label: category,
}))

export const TODO_FILTER_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "active", label: "진행중" },
  { value: "completed", label: "완료" },
]

export const TODO_SORT_OPTIONS = [
  { value: "date", label: "날짜순" },
  { value: "priority", label: "우선순위" },
  { value: "category", label: "카테고리" },
]
