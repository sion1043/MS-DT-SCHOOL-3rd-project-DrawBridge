"use client"

import {
  Filter,
  RotateCcw,
  Briefcase,
  Clock,
  GraduationCap,
  Code,
  MapPin,
  DollarSign,
  FileText,
  Send,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FilterDropdown } from "@/components/company_monitor/filter/filter-dropdown"
import { SortDropdown } from "@/components/company_monitor/filter/sort-dropdown"
import { ActiveFilters } from "@/components/company_monitor/filter/active-filters"
import { useApiOptions } from "@/hooks/company_monitor/use-api-options"
import type { FilterSidebarProps } from "@/types/company_monitor/FilterSidebarProps"

const FILTER_OPTIONS = {
  sortBy: ["성장률 (높은순)", "성장률 (낮은순)", "이름 (가나다순)", "이름 (가나다 역순)", "경력 (높은순)", "경력 (낮은순)", "연봉 (높은순)", "연봉 (낮은순)",],
  experience: ["전체", "신입", "1-3년", "4-7년", "8-10년", "10-15년", "16-20년", "20년+"],
  education: ["전체", "고졸미만", "고졸(예정)", "초대졸(예정)", "대졸(예정)", "석박사(예정)", "석박사"],
  location: ["전체", "서울", "경기", "부산", "대구", "인천", "원격근무"],
  startDate: ["전체", "즉시", "1개월 이내", "3개월 이내", "협의"],
  salary: ["전체", "3000만원 이하", "3000-5000만원", "5000-7000만원", "7000만원 이상"],
  previousApplications: ["전체", "있음", "없음"],
}

const FALLBACK = [
  "FALLBACK"
]

export function FilterSidebar({
  onFilterChange,
  onResetFilters,
  onSortChange,
  currentFilters = {},
  totalCandidates = 0,
}: FilterSidebarProps) {
  const { options: jobPostingOptions, loading: jobPostingLoading } = useApiOptions(
    "/api/company_monitor/job-postings",
    FALLBACK,
  )
  const { options: positionOptions, loading: positionLoading } = useApiOptions(
    "/api/company_monitor/job-positions",
    FALLBACK
  )
  const { options: skillsOptions, loading: skillsLoading } = useApiOptions(
    "/api/company_monitor/get-company-skills",
    FALLBACK
  )

  const appliedFiltersCount = Object.values(currentFilters).reduce((count, values) => {
    const valuesArray = Array.isArray(values) ? values : []
    return count + valuesArray.filter((v) => v && v !== "전체").length
  }, 0)

  const getFilterDisplayName = (key: string, value: string) => {
    const displayNames: Record<string, Record<string, string>> = {
      // sortBy: Object.fromEntries(FILTER_OPTIONS.sortBy.map((sort) => [sort, sort])),
      jobPosting: Object.fromEntries(jobPostingOptions.map((posting) => [posting, posting])),
      position: Object.fromEntries(positionOptions.map((pos) => [pos, pos])),
      experience: Object.fromEntries(FILTER_OPTIONS.experience.map((exp) => [exp, exp])),
      skills: Object.fromEntries(skillsOptions.map((skill) => [skill, skill])),
      education: Object.fromEntries(FILTER_OPTIONS.education.map((edu) => [edu, edu])),
      location: Object.fromEntries(FILTER_OPTIONS.location.map((loc) => [loc, loc])),
      startDate: Object.fromEntries(FILTER_OPTIONS.startDate.map((start) => [start, start])),
      salary: Object.fromEntries(FILTER_OPTIONS.salary.map((salary) => [salary, salary])),
      previousApplications: Object.fromEntries(FILTER_OPTIONS.previousApplications.map((prev) => [prev, prev])),
    }
    return displayNames[key]?.[value] || value
  }

  const activeFilters = Object.entries(currentFilters).flatMap(([key, values]) => {
    const valuesArray = Array.isArray(values) ? values : []
    return valuesArray
      .filter((value) => value && value !== "전체")
      .map((value) => ({
        key,
        value,
        displayName: getFilterDisplayName(key, value),
      }))
  })

  const handleRemoveFilter = (key: string, value: string) => {
    const currentValues = currentFilters[key] || []
    const newValues = currentValues.filter((v) => v !== value)
    onFilterChange(key, newValues)
  }

  return (
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-500" />
            <div>
              <h2 className="text-xl font-semibold text-slate-900">필터</h2>
              <div className="text-sm text-blue-600">{appliedFiltersCount}개 필터 적용됨</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 bg-transparent"
            >
              <RotateCcw className="h-4 w-4" />
              초기화
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-4">
          <SortDropdown
            currentSort={currentFilters.sortBy || "성장률 (높은순)"}
            onSortChange={onSortChange}
          />

          <FilterDropdown
            label="지원 공고"
            icon={<Briefcase className="h-4 w-4 text-blue-500" />}
            options={jobPostingOptions}
            selectedValues={currentFilters.jobPosting || []}
            onSelectionChange={(values) => onFilterChange("jobPosting", values)}
            loading={jobPostingLoading}
          />

          <FilterDropdown
            label="직무"
            icon={<Briefcase className="h-4 w-4 text-blue-500" />}
            options={positionOptions}
            selectedValues={currentFilters.position || []}
            onSelectionChange={(values) => onFilterChange("position", values)}
            loading={positionLoading}
          />

          <FilterDropdown
            label="경력"
            icon={<Clock className="h-4 w-4 text-purple-500" />}
            options={FILTER_OPTIONS.experience}
            selectedValues={currentFilters.experience || []}
            onSelectionChange={(values) => onFilterChange("experience", values)}
          />
        </div>

        <div className="grid grid-cols-6 gap-3 mb-4">
          <FilterDropdown
            label="기술 스택"
            icon={<Code className="h-4 w-4 text-orange-500" />}
            options={skillsOptions}
            selectedValues={currentFilters.skills || []}
            onSelectionChange={(values) => onFilterChange("skills", values)}
            loading={skillsLoading}
          />

          <FilterDropdown
            label="학력"
            icon={<GraduationCap className="h-4 w-4 text-indigo-500" />}
            options={FILTER_OPTIONS.education}
            selectedValues={currentFilters.education || []}
            onSelectionChange={(values) => onFilterChange("education", values)}
          />

          <FilterDropdown
            label="위치"
            icon={<MapPin className="h-4 w-4 text-green-500" />}
            options={FILTER_OPTIONS.location}
            selectedValues={currentFilters.location || []}
            onSelectionChange={(values) => onFilterChange("location", values)}
          />

          <FilterDropdown
            label="입사 시기"
            icon={<Clock className="h-4 w-4 text-teal-500" />}
            options={FILTER_OPTIONS.startDate}
            selectedValues={currentFilters.startDate || []}
            onSelectionChange={(values) => onFilterChange("startDate", values)}
          />

          <FilterDropdown
            label="연봉 범위"
            icon={<DollarSign className="h-4 w-4 text-emerald-500" />}
            options={FILTER_OPTIONS.salary}
            selectedValues={currentFilters.salary || []}
            onSelectionChange={(values) => onFilterChange("salary", values)}
          />

          <FilterDropdown
            label="이전 지원 여부"
            icon={<FileText className="h-4 w-4 text-slate-500" />}
            options={FILTER_OPTIONS.previousApplications}
            selectedValues={currentFilters.previousApplications || []}
            onSelectionChange={(values) => onFilterChange("previousApplications", values)}
          />
        </div>

        <ActiveFilters activeFilters={activeFilters} onRemoveFilter={handleRemoveFilter} />
      </CardContent>
    </Card>
  )
}
