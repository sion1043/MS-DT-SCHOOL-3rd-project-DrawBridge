"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

interface IntegratedCareerChartProps {
  filters: any
}

// 샘플 데이터 - 연차별 연봉과 기술 스택 분포를 통합
const generateIntegratedData = () => {
  const techStacks = [
    { name: "React", color: "#61DAFB" },
    { name: "Vue", color: "#4FC08D" },
    { name: "Angular", color: "#DD0031" },
    { name: "Node.js", color: "#339933" },
    { name: "Python", color: "#3776AB" },
    { name: "Java", color: "#ED8B00" },
    { name: "Spring", color: "#6DB33F" },
    { name: "Django", color: "#092E20" },
    { name: "MySQL", color: "#4479A1" },
    { name: "PostgreSQL", color: "#336791" },
    { name: "MongoDB", color: "#47A248" },
    { name: "Redis", color: "#DC382D" },
    { name: "Docker", color: "#2496ED" },
    { name: "Kubernetes", color: "#326CE5" },
    { name: "AWS", color: "#FF9900" },
    { name: "TypeScript", color: "#3178C6" },
  ]

  return Array.from({ length: 20 }, (_, i) => {
    const experience = i + 1
    const baseSalary = 3000 + experience * 800 + Math.random() * 1000

    // 각 연차별로 기술 스택 분포 생성
    const stackData = techStacks
      .map((stack) => ({
        ...stack,
        value: Math.max(0, Math.random() * 100 - Math.abs(experience - 7) * 5),
        demand: Math.floor(Math.random() * 50) + 10,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8)

    return {
      experience,
      salary: Math.floor(baseSalary),
      stacks: stackData,
      totalJobs: Math.floor(Math.random() * 200) + 50,
    }
  })
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-card border border-border rounded-lg p-4 shadow-lg min-w-[300px]">
        <h3 className="font-semibold text-lg mb-2 text-primary">경력 {label}년</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">평균 연봉:</span>
            <span className="font-semibold text-primary">{data.salary.toLocaleString()}만원</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">채용공고 수:</span>
            <span className="font-semibold">{data.totalJobs}개</span>
          </div>
          <div className="mt-3">
            <h4 className="font-medium mb-2 text-sm">주요 기술 스택 분포</h4>
            <div className="space-y-1">
              {data.stacks.slice(0, 5).map((stack: any, index: number) => (
                <div key={stack.name} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: stack.color }} />
                    <span>{stack.name}</span>
                  </div>
                  <span className="font-medium">{Math.round(stack.value)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export function IntegratedCareerChart({ filters }: IntegratedCareerChartProps) {
  const [data] = useState(generateIntegratedData())
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)

  return (
    <div className="w-full h-[700px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 40, left: 60, bottom: 80 }}
          onMouseLeave={() => setHoveredBar(null)}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis
            dataKey="experience"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            label={{
              value: "경력 (년)",
              position: "insideBottom",
              offset: -20,
              style: { textAnchor: "middle", fill: "hsl(var(--muted-foreground))" },
            }}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            label={{
              value: "연봉 (만원)",
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle", fill: "hsl(var(--muted-foreground))" },
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="salary" radius={[6, 6, 0, 0]} maxBarSize={60} onMouseEnter={(_, index) => setHoveredBar(index)}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={hoveredBar === index ? "hsl(var(--primary))" : "#F4B819"}
                opacity={hoveredBar === index ? 1 : 0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
