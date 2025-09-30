"use client"

import { Search, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface DashboardHeaderProps {
  searchQuery: string
  requiredSkills: string
  selectedFilters: string[]
  onSearchChange: (value: string) => void
  onRequiredSkillsChange: (value: string) => void
  onShowAnalytics: () => void
  onRemoveFilter: (filter: string) => void
}

export function DashboardHeader({
  searchQuery,
  requiredSkills,
  selectedFilters,
  onSearchChange,
  onRequiredSkillsChange,
  onShowAnalytics,
  onRemoveFilter,
}: DashboardHeaderProps) {
  return (
    <div className="border-b bg-white p-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Company Dashboard</h1>
          <Button onClick={onShowAnalytics} className="bg-[#F4B819] text-black hover:bg-[#E5A617]">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search candidates by name, skills, or location..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
          <div className="w-80 relative">
            <Input
              placeholder="Required skills..."
              value={requiredSkills}
              onChange={(e) => onRequiredSkillsChange(e.target.value)}
              className="h-12"
            />
          </div>
        </div>

        {/* Filter Tags */}
        {selectedFilters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedFilters.map((filter) => (
              <Badge
                key={filter}
                variant="secondary"
                className="bg-[#F4B819] text-black hover:bg-[#E5A617] cursor-pointer"
                onClick={() => onRemoveFilter(filter)}
              >
                #{filter} ×
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
