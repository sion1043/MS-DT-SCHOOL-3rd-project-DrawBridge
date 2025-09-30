import type { FilterState } from "@/hooks/use-filter-state"

export interface FilterSidebarProps {
  onFilterChange: (filterType: string, values: string[]) => void
  onResetFilters: () => void
  onSortChange: (sortType: string) => void
  currentFilters?: FilterState
  totalCandidates?: number
}
