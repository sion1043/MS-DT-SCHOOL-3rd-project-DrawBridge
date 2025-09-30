"use client"

import { X } from "lucide-react"

interface ActiveFilter {
  key: string
  value: string
  displayName: string
}

interface ActiveFiltersProps {
  activeFilters: ActiveFilter[]
  onRemoveFilter: (key: string, value: string) => void
}

export function ActiveFilters({ activeFilters, onRemoveFilter }: ActiveFiltersProps) {
  if (activeFilters.length === 0) return null

  return (
    <div className="border-t border-slate-200 pt-4">
      <div className="text-sm font-medium text-slate-700 mb-3">적용된 필터</div>
      <div className="flex flex-wrap gap-2">
        {activeFilters.map(({ key, value, displayName }) => (
          <div
            key={`${key}-${value}`}
            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200"
          >
            <span>{displayName}</span>
            <button onClick={() => onRemoveFilter(key, value)} className="ml-1 hover:bg-blue-100 rounded-full p-0.5">
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
