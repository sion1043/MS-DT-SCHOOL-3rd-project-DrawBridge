"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown } from "lucide-react"
import type { FilterOption } from "@/types"

interface SortSelectProps {
  value: string
  onChange: (value: string) => void
  options: FilterOption[]
  className?: string
}

export function SortSelect({ value, onChange, options, className }: SortSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <ArrowUpDown className="w-4 h-4 mr-2" />
        <SelectValue placeholder="정렬" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
