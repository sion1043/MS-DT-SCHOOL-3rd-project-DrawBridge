"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Filter, ArrowUpDown } from "lucide-react"

interface JobFiltersProps {
  sortBy: string
  filterBy: string
  onSortChange: (sort: string) => void
  onFilterChange: (filter: string) => void
}

export function JobFilters({ sortBy, filterBy, onSortChange, onFilterChange }: JobFiltersProps) {
  return (
    <div className="flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-1" />
            필터
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onFilterChange("all")}>전체</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterChange("high-match")}>고매칭 (90%+)</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterChange("대기업")}>대기업</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterChange("스타트업")}>스타트업</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterChange("remote")}>재택근무</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <ArrowUpDown className="w-4 h-4 mr-1" />
            정렬
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onSortChange("matchRate")}>매칭률 높은 순</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange("salary")}>연봉 높은 순</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange("deadline")}>마감일 빠른 순</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange("company")}>회사명 순</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
