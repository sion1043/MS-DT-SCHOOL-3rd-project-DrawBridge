"use client"

import { useState, useCallback } from "react"

export interface FilterState {
  sortBy: string
  jobPosting: string[]
  position: string[]
  experience: string[]
  skills: string[]
  education: string[]
  location: string[]
  startDate: string[]
  salary: string[]
  previousApplications: string[]
}

export function useFilterState(initialFilters: Partial<FilterState> = {}) {
  const [filters, setFilters] = useState<FilterState>({
    sortBy: "성장률 (높은순)",
    jobPosting: [],
    position: [],
    experience: [],
    skills: [],
    education: [],
    location: [],
    startDate: [],
    salary: [],
    previousApplications: [],
    ...initialFilters,
  })

  const updateFilter = useCallback((filterType: string, values: string[]) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: values,
    }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({
      sortBy: "성장률 (높은순)",
      jobPosting: [],
      position: [],
      experience: [],
      skills: [],
      education: [],
      location: [],
      startDate: [],
      salary: [],
      previousApplications: [],
    })
  }, [])

  const appliedFiltersCount = Object.values(filters).reduce((count, values) => {
    const valuesArray = Array.isArray(values) ? values : []
    return count + valuesArray.filter((v) => v && v !== "전체").length
  }, 0)
  console.log("data", "filters", filters)

  return {
    filters,
    updateFilter,
    resetFilters,
    appliedFiltersCount,
  }
}
