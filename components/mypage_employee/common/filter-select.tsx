"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FilterOption } from "@/types/mypage_employee"

interface FilterSelectProps {
  value: string
  onChange: (value: string) => void
  options: FilterOption[]
  placeholder?: string
  className?: string
}

export function FilterSelect({ value, onChange, options, placeholder = "선택하세요", className }: FilterSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
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
