"use client"

import { useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts"

interface TechStackChartProps {
  filters: any
}

export function TechStackChart({ filters }: TechStackChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Mock data - 실제로는 필터에 따라 동적으로 변경될 데이터
  const techStackData = [
    { name: "React", percentage: 85, jobs: 1240, color: "hsl(var(--chart-1))" },
    { name: "JavaScript", percentage: 92, jobs: 1450, color: "hsl(var(--chart-2))" },
    { name: "TypeScript", percentage: 78, jobs: 980, color: "hsl(var(--chart-3))" },
    { name: "Node.js", percentage: 65, jobs: 820, color: "hsl(var(--chart-4))" },
    { name: "Python", percentage: 58, jobs: 730, color: "hsl(var(--chart-5))" },
    { name: "Java", percentage: 52, jobs: 650, color: "hsl(var(--chart-1))" },
    { name: "Spring", percentage: 45, jobs: 560, color: "hsl(var(--chart-2))" },
    { name: "MySQL", percentage: 42, jobs: 520, color: "hsl(var(--chart-3))" },
    { name: "AWS", percentage: 38, jobs: 480, color: "hsl(var(--chart-4))" },
    { name: "Docker", percentage: 35, jobs: 440, color: "hsl(var(--chart-5))" },
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-card border rounded-lg p-4 shadow-lg min-w-48">
          <p className="font-semibold text-lg mb-2">{`${label} 상세 정보`}</p>
          <div className="space-y-1">
            <p className="text-primary font-medium">{`요구 비율: ${data.percentage}%`}</p>
            <p className="text-muted-foreground">{`관련 채용공고: ${data.jobs}개`}</p>
          </div>

          {/* 호버 시 추가 정보 표시 */}
          <div className="mt-3 pt-3 border-t">
            <p className="text-sm font-medium mb-2">주요 요구사항:</p>
            <div className="text-xs text-muted-foreground space-y-1">
              {label === "React" && (
                <>
                  <p>• React Hooks 숙련도</p>
                  <p>• 상태관리 (Redux, Zustand)</p>
                  <p>• Next.js 경험 우대</p>
                </>
              )}
              {label === "JavaScript" && (
                <>
                  <p>• ES6+ 문법 숙련</p>
                  <p>• 비동기 처리 이해</p>
                  <p>• DOM 조작 경험</p>
                </>
              )}
              {label === "Python" && (
                <>
                  <p>• Django/Flask 프레임워크</p>
                  <p>• 데이터 분석 라이브러리</p>
                  <p>• API 개발 경험</p>
                </>
              )}
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={techStackData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={(value) => `${value}%`} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={80} />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="percentage"
            radius={[0, 4, 4, 0]}
            onMouseEnter={(_, index) => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {techStackData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={hoveredIndex === index ? "hsl(var(--primary))" : entry.color}
                opacity={hoveredIndex === index ? 1 : 0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
