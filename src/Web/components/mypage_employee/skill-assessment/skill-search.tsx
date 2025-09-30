"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SearchInput } from "@/components/mypage_employee/common/search-input"
import { PageHeader } from "@/components/mypage_employee/common/page-header"
import { searchSkills } from "@/lib/mypage_employee/skill-utils"
import { ALL_SKILLS } from "@/constants/mypage_employee/skills"

interface SkillSearchProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onSkillSelect: (skill: string) => void
  onBack: () => void
}

export function SkillSearch({ searchQuery, onSearchChange, onSkillSelect, onBack }: SkillSearchProps) {
  const filteredSkills = searchSkills(ALL_SKILLS, searchQuery)

  return (
    <div className="space-y-6">
      <PageHeader title="스킬 찾기" onBack={onBack} />

      <Card>
        <CardContent className="p-6">
          <SearchInput
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="검사할 기술스택을 검색하세요..."
            className="mb-6"
          />

          <div className="text-sm text-muted-foreground mb-4">총 {filteredSkills.length}개의 스킬이 있습니다.</div>

          <div className="grid grid-cols-3 gap-2 max-h-96 overflow-y-auto">
            {filteredSkills.map((skill, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start h-auto p-3 text-sm bg-transparent"
                onClick={() => onSkillSelect(skill)}
              >
                {skill}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
