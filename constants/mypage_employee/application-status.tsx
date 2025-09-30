import type { ApplicationStatus } from "@/types/mypage_employee"

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "지원 완료",
  "서류 심사 중",
  "면접 예정",
  "최종 합격",
  "불합격",
]

export const APPLICATION_STATUS_COLORS: Record<ApplicationStatus, { bg: string; text: string }> = {
  "지원 완료": { bg: "bg-gray-500", text: "text-white" },
  "서류 심사 중": { bg: "bg-yellow-500", text: "text-black" },
  "면접 예정": { bg: "bg-blue-500", text: "text-white" },
  "최종 합격": { bg: "bg-green-500", text: "text-white" },
  불합격: { bg: "bg-red-500", text: "text-white" },
}

export const APPLICATION_STATUS_OPTIONS = APPLICATION_STATUSES.map((status) => ({
  value: status,
  label: status,
}))
