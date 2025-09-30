"use client"

import { useState, useCallback } from "react"
import { useLocalStorage } from "./use-local-storage"
import { getCurrentDateString } from "@/lib/mypage_employee/date-utils"
import type { JobApplication, ApplicationStatus } from "@/types/mypage_employee"

const INITIAL_APPLICATIONS: JobApplication[] = [
  {
    id: "1",
    company: "네이버",
    position: "프론트엔드 개발자",
    status: "서류 심사 중",
    date: "2024.03.15",
    statusColor: "bg-yellow-500",
    textColor: "text-black",
  },
  {
    id: "2",
    company: "카카오",
    position: "풀스택 개발자",
    status: "면접 예정",
    date: "2024.03.12",
    statusColor: "bg-blue-500",
    textColor: "text-white",
  },
  {
    id: "3",
    company: "토스",
    position: "백엔드 개발자",
    status: "최종 합격",
    date: "2024.03.10",
    statusColor: "bg-green-500",
    textColor: "text-white",
  },
]

const STATUS_COLORS: Record<ApplicationStatus, { bg: string; text: string }> = {
  "지원 완료": { bg: "bg-gray-500", text: "text-white" },
  "서류 심사 중": { bg: "bg-yellow-500", text: "text-black" },
  "면접 예정": { bg: "bg-blue-500", text: "text-white" },
  "최종 합격": { bg: "bg-green-500", text: "text-white" },
  불합격: { bg: "bg-red-500", text: "text-white" },
}

export function useApplications() {
  const [applications, setApplications] = useLocalStorage<JobApplication[]>("mypage-applications", INITIAL_APPLICATIONS)
  const [filter, setFilter] = useState<ApplicationStatus | "all">("all")
  const [sortBy, setSortBy] = useState<"date" | "company" | "status">("date")

  const addApplication = useCallback(
    (company: string, position: string, status: ApplicationStatus = "지원 완료") => {
      const colors = STATUS_COLORS[status]
      const newApplication: JobApplication = {
        id: Date.now().toString(),
        company,
        position,
        status,
        date: getCurrentDateString().replace(/-/g, "."),
        statusColor: colors.bg,
        textColor: colors.text,
      }

      setApplications((prev) => [...prev, newApplication])
    },
    [setApplications],
  )

  const updateApplicationStatus = useCallback(
    (id: string, status: ApplicationStatus) => {
      const colors = STATUS_COLORS[status]
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id
            ? {
                ...app,
                status,
                statusColor: colors.bg,
                textColor: colors.text,
              }
            : app,
        ),
      )
    },
    [setApplications],
  )

  const deleteApplication = useCallback(
    (id: string) => {
      setApplications((prev) => prev.filter((app) => app.id !== id))
    },
    [setApplications],
  )

  const getFilteredApplications = useCallback(() => {
    let filtered = applications

    // Apply filter
    if (filter !== "all") {
      filtered = filtered.filter((app) => app.status === filter)
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "company":
          return a.company.localeCompare(b.company)
        case "status":
          return a.status.localeCompare(b.status)
        case "date":
        default:
          return new Date(b.date.replace(/\./g, "-")).getTime() - new Date(a.date.replace(/\./g, "-")).getTime()
      }
    })
  }, [applications, filter, sortBy])

  const getStats = useCallback(() => {
    const total = applications.length
    const pending = applications.filter((app) => app.status === "서류 심사 중" || app.status === "면접 예정").length
    const accepted = applications.filter((app) => app.status === "최종 합격").length
    const rejected = applications.filter((app) => app.status === "불합격").length

    return { total, pending, accepted, rejected }
  }, [applications])

  return {
    applications: getFilteredApplications(),
    filter,
    sortBy,
    setFilter,
    setSortBy,
    addApplication,
    updateApplicationStatus,
    deleteApplication,
    stats: getStats(),
  }
}
