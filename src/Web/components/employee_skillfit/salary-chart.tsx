"use client"

import { useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

interface SalaryChartProps {
  filters: any
}

export function SalaryChart({ filters }: SalaryChartProps) {
  const [hoveredData, setHoveredData] = useState<any>(null)

  // Mock data - 실제로는 API에서 가져올 데이터
  const salaryData = [
    { experience: "신입", salary: 3500, count: 245 },
    { experience: "1년", salary: 4200, count: 189 },
    { experience: "2년", salary: 5100, count: 167 },
    { experience: "3년", salary: 6200, count: 143 },
    { experience: "4년", salary: 7400, count: 128 },
    { experience: "5년", salary: 8800, count: 112 },
    { experience: "6년", salary: 10200, count: 98 },
    { experience: "7년", salary: 11800, count: 87 },
    { experience: "8년", salary: 13500, count: 76 },
    { experience: "9년", salary: 15200, count: 65 },
    { experience: "10년+", salary: 17500, count: 54 },
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-semibold">{`경력: ${label}`}</p>
          <p className="text-primary">{`평균 연봉: ${data.salary.toLocaleString()}만원`}</p>
          <p className="text-muted-foreground text-sm">{`채용공고 수: ${data.count}개`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={salaryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="experience" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `${value.toLocaleString()}만원`} />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="salary"
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
            onMouseEnter={(data) => setHoveredData(data)}
            onMouseLeave={() => setHoveredData(null)}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
