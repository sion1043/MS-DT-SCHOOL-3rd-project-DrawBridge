"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

interface FilterDropdownProps {
  label: string
  icon: React.ReactNode
  options: string[]
  selectedValues: string[]
  onSelectionChange: (values: string[]) => void
  loading?: boolean
  className?: string
}

export function FilterDropdown({
  label,
  icon,
  options,
  selectedValues,
  onSelectionChange,
  loading = false,
  className = "",
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleSelection = (option: string) => {
    if (option === "전체") {
      onSelectionChange([])
    } else {
      const newValues = selectedValues.includes(option)
        ? selectedValues.filter((v) => v !== option)
        : [...selectedValues.filter((v) => v !== "전체"), option]
      onSelectionChange(newValues)
    }
  }

  const isSelected = (option: string) => {
    if (option === "전체") {
      return selectedValues.length === 0
    }
    return selectedValues.includes(option)
  }

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        className="w-full h-10 px-3 text-sm bg-white hover:bg-slate-50 border-slate-300 flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
      >
        <div className="flex items-center gap-2">
          {icon}
          {loading ? "로딩중..." : label}
          {selectedValues.length > 0 && (
            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 ml-1">
              {selectedValues.length}
            </span>
          )}
        </div>
        <ChevronDown className="h-4 w-4" />
      </Button>
      {isOpen && (
        <div className="absolute top-12 left-0 z-10 bg-white border border-slate-200 rounded-lg shadow-lg p-2 min-w-full max-h-60 overflow-y-auto">
          {options.map((option) => (
            <label key={option} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded cursor-pointer">
              <input
                type="checkbox"
                checked={isSelected(option)}
                onChange={() => toggleSelection(option)}
                className="rounded border-slate-300"
              />
              <span className="text-sm">{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
