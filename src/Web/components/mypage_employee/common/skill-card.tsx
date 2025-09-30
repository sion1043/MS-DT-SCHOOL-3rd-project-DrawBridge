"use client"

import { getScoreColor, formatDate } from "@/lib/mypage_employee/skill-utils"
import type { SkillStack } from "@/types/mypage_employee"

interface SkillCardProps {
  skill: SkillStack
  onClick?: () => void
  className?: string
}

export function SkillCard({ skill, onClick, className }: SkillCardProps) {
  return (
    <div
      className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <div>
          <h3 className="font-semibold text-foreground">{skill.name}</h3>
          <p className="text-sm text-muted-foreground">{skill.category}</p>
        </div>
      </div>
      <div className="text-right">
        <div className={`text-2xl font-bold ${getScoreColor(skill.score)}`}>{skill.score}점</div>
        <div className="text-sm text-muted-foreground">{formatDate(skill.lastTested)}</div>
      </div>
    </div>
  )
}
