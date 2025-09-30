"use client"

import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface SimilarProfilesProps {
  filters: any
}

export function SimilarProfiles({ filters }: SimilarProfilesProps) {
  // Mock data - 실제로는 필터 조건과 비슷한 구직자들의 데이터
  const similarProfiles = [
    { skill: "React", proficiency: 85, count: 234 },
    { skill: "JavaScript", proficiency: 92, count: 267 },
    { skill: "TypeScript", proficiency: 78, count: 189 },
    { skill: "Node.js", proficiency: 65, count: 156 },
    { skill: "CSS", proficiency: 88, count: 245 },
    { skill: "Git", proficiency: 95, count: 289 },
  ]

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        비슷한 조건의 구직자 {similarProfiles.reduce((sum, p) => sum + p.count, 0)}명의 평균 스킬 숙련도
      </p>

      <div className="space-y-3">
        {similarProfiles.map((profile) => (
          <div key={profile.skill} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{profile.skill}</span>
                <Badge variant="outline" className="text-xs">
                  {profile.count}명
                </Badge>
              </div>
              <span className="text-sm text-muted-foreground">{profile.proficiency}%</span>
            </div>
            <Progress value={profile.proficiency} className="h-2" />
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground">
          💡 <strong>추천:</strong> TypeScript와 Node.js 숙련도를 높이면 더 많은 기회를 얻을 수 있습니다.
        </p>
      </div>
    </div>
  )
}
