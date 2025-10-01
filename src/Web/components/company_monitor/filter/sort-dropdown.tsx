"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, ChevronDown } from "lucide-react"

interface SortDropdownProps {
  currentSort: string
  onSortChange: (sortType: string) => void
}

const sortOptions = [
  { label: "성장률 (높은순)", value: "성장률 (높은순)" },
  { label: "성장률 (낮은순)", value: "성장률 (낮은순)" },
  { label: "이름 (가나다순)", value: "이름 (가나다순)" },
  { label: "이름 (가나다 역순)", value: "이름 (가나다 역순)" },
  { label: "경력 (높은순)", value: "경력 (높은순)" },
  { label: "경력 (낮은순)", value: "경력 (낮은순)" },
  { label: "연봉 (높은순)", value: "연봉 (높은순)" },
  { label: "연봉 (낮은순)", value: "연봉 (낮은순)" },
]

export function SortDropdown({ currentSort, onSortChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const currentLabel = sortOptions.find((option) => option.value === currentSort)?.label || "정렬 기준"

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="w-full h-10 px-3 text-sm bg-white hover:bg-slate-50 border-slate-300 flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-green-500" />
          {currentLabel}
        </div>
        <ChevronDown className="h-4 w-4" />
      </Button>
      {isOpen && (
        <div className="absolute top-12 left-0 z-10 bg-white border border-slate-200 rounded-lg shadow-lg p-2 min-w-full">
          {sortOptions.map((option) => (
            <Button
              key={option.value}
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm"
              onClick={() => {
                onSortChange(option.value)
                setIsOpen(false)
              }}
            >
              {option.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
