"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Download, BarChart3, X } from "lucide-react"
import { AnalyticsModal } from "./analytics-modal"

interface DashboardHeaderProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  selectedFilters: string[]
  onRemoveFilter: (filter: string) => void
  candidateCount: number
}

export function DashboardHeader({
  searchTerm,
  onSearchChange,
  selectedFilters,
  onRemoveFilter,
  candidateCount,
}: DashboardHeaderProps) {
  const [showAnalytics, setShowAnalytics] = useState(false)

  return (
    <div className="bg-white border-b">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Candidate Management</h1>
            <p className="text-gray-600">Manage and review job applicants</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
              onClick={() => setShowAnalytics(true)}
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Button>
          </div>
        </div>

        {selectedFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedFilters.map((filter) => (
              <Badge key={filter} variant="secondary" className="flex items-center gap-1">
                {filter}
                <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => onRemoveFilter(filter)} />
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="text-sm text-gray-600">{candidateCount} candidates found</div>
        </div>
      </div>

      {showAnalytics && <AnalyticsModal onClose={() => setShowAnalytics(false)} />}
    </div>
  )
}
