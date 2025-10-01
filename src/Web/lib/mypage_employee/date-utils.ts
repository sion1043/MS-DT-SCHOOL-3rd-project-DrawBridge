export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function getRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const diffInMs = now.getTime() - d.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return "오늘"
  if (diffInDays === 1) return "어제"
  if (diffInDays < 7) return `${diffInDays}일 전`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}주 전`
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}개월 전`
  return `${Math.floor(diffInDays / 365)}년 전`
}

export function isToday(date: Date | string): boolean {
  const d = typeof date === "string" ? new Date(date) : date
  const today = new Date()
  return d.toDateString() === today.toDateString()
}

export function isFuture(date: Date | string): boolean {
  const d = typeof date === "string" ? new Date(date) : date
  return d > new Date()
}

export function addDays(date: Date | string, days: number): Date {
  const d = typeof date === "string" ? new Date(date) : new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function getCurrentDateString(): string {
  return new Date().toISOString().split("T")[0]
}
