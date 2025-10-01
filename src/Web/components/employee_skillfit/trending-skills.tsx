"use client"

import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

export function TrendingSkills() {
  const trendingSkills = [
    { name: "Next.js", growth: "+45%", trend: "up" },
    { name: "TypeScript", growth: "+38%", trend: "up" },
    { name: "Tailwind CSS", growth: "+52%", trend: "up" },
    { name: "GraphQL", growth: "+28%", trend: "up" },
    { name: "Rust", growth: "+67%", trend: "up" },
    { name: "Go", growth: "+34%", trend: "up" },
    { name: "jQuery", growth: "-23%", trend: "down" },
    { name: "PHP", growth: "-15%", trend: "down" },
  ]

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground mb-4">최근 6개월 동안 채용공고에서 가장 많이 언급된 기술들</p>

      <div className="space-y-2">
        {trendingSkills.map((skill, index) => (
          <div
            key={skill.name}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              {skill.trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-secondary" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              <span className="font-medium">{skill.name}</span>
            </div>
            <Badge
              variant={skill.trend === "up" ? "default" : "destructive"}
              className={
                skill.trend === "up"
                ? "border-green-200 bg-green-100 text-white-700"
                : "border-red-200 bg-red-100 text-white-700"
              }
            >
              {skill.growth}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  )
}
