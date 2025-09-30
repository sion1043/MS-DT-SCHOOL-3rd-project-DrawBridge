"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/mypage_employee/common/stat-card"
import { FilterSelect } from "@/components/mypage_employee/common/filter-select"
import { SortSelect } from "@/components/mypage_employee/common/sort-select"
import { SkillCard } from "@/components/mypage_employee/common/skill-card"
import { EmptyState } from "@/components/mypage_employee/common/empty-state"
import { PageHeader } from "@/components/mypage_employee/common/page-header"
import { calculateAverageScore, sortSkills, filterSkillsByCategory } from "@/lib/mypage_employee/skill-utils"
import { SKILL_CATEGORY_OPTIONS, SORT_OPTIONS } from "@/constants/mypage_employee/skills"
import { Target } from "lucide-react"
import type { SkillStack, SortOption } from "@/types/mypage_employee"

interface SkillResultsProps {
  skillStacks: SkillStack[]
  sortBy: SortOption
  filterCategory: string
  onSortChange: (sort: SortOption) => void
  onFilterChange: (category: string) => void
  onStartNewAssessment: () => void
}

export function SkillResults({
  skillStacks,
  sortBy,
  filterCategory,
  onSortChange,
  onFilterChange,
  onStartNewAssessment,
}: SkillResultsProps) {
  const averageScore = calculateAverageScore(skillStacks)
  const filteredSkills = filterSkillsByCategory(skillStacks, filterCategory)
  const sortedSkills = sortSkills(filteredSkills, sortBy)

  return (
    <div className="space-y-6">
      <PageHeader
        title="숙련도 검사"
        description="기술스택별 숙련도 점수 및 검사 이력"
        action={{
          label: "새로 검사하기",
          onClick: onStartNewAssessment,
        }}
      />

      <StatCard
        title="전체 평균 점수"
        value={`${averageScore}점`}
        description={`총 ${skillStacks.length}개 기술스택`}
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>기술스택별 숙련도</CardTitle>
            <div className="flex items-center space-x-4">
              {/* <FilterSelect
                value={filterCategory}
                onChange={onFilterChange}
                options={SKILL_CATEGORY_OPTIONS}
                placeholder="카테고리"
                className="w-40"
              /> */}

              <SortSelect
                value={sortBy}
                onChange={(value) => onSortChange(value as SortOption)}
                options={SORT_OPTIONS}
                className="w-40"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {sortedSkills.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {sortedSkills.map((skill, index) => (
                <SkillCard key={index} skill={skill} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="해당 카테고리에 기술스택이 없습니다"
              description="다른 카테고리를 선택하거나 새로운 스킬 검사를 시작해보세요"
              actionLabel="새로 검사하기"
              onAction={onStartNewAssessment}
              icon={<Target className="w-12 h-12" />}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
