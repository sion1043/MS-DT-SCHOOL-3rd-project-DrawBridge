"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { useState } from "react"
import { useApi } from "@/hooks/employee_trend/use-api"
import type { AIDistribution } from "@/types/employee_trend"
import { Loader2 } from "lucide-react"

const COLORS = [
  "#3B82F6", // blue-500
  "#10B981", // emerald-500
  "#F59E0B", // amber-500
  "#EF4444", // red-500
  "#8B5CF6", // violet-500
  "#06B6D4", // cyan-500
  "#84CC16", // lime-500
  "#F97316", // orange-500
  "#EC4899", // pink-500
  "#14B8A6", // teal-500
  "#A855F7", // purple-500
  "#22C55E", // green-500
  "#F472B6", // pink-400
  "#6366F1", // indigo-500
  "#EAB308", // yellow-500
  "#DC2626", // red-600
  "#7C3AED", // violet-600
  "#059669", // emerald-600
  "#D97706", // amber-600
  "#6B7280", // gray-500
]

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0]
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-800">{data.name}</p>
        <p className="text-sm text-gray-600">{data.value} models</p>
      </div>
    )
  }
  return null
}

export function AIDistributionCharts() {
  const [hoveredIndex1, setHoveredIndex1] = useState<number | null>(null)
  const [hoveredIndex2, setHoveredIndex2] = useState<number | null>(null)

  const {
    data: distributionData,
    loading,
    error,
  } = useApi<{
    fieldDistribution: AIDistribution[]
    libraryDistribution: AIDistribution[]
  }>("/api/employee_trend/ai-distribution")
  console.log("data", distributionData)

  if (loading) {
    return (
      <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 h-[600px] flex flex-col">
        <CardContent className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 h-[600px] flex flex-col">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-destructive">데이터를 불러오는데 실패했습니다: {error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!distributionData) {
    return (
      <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 h-[600px] flex flex-col">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">데이터가 없습니다.</p>
        </CardContent>
      </Card>
    )
  }

  const { fieldDistribution, libraryDistribution } = distributionData

  return (
    <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 h-[600px] flex flex-col">
      <CardHeader className="pb-4 flex-shrink-0">
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          AI 모델 카테고리 분포
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">분야별 모델 비중</p>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          <div className="flex flex-col">
            <h3 className="text-base font-medium text-gray-700 mb-4 text-center">분야별 모델 분포</h3>
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative mb-4">
                <ResponsiveContainer width={200} height={200}>
                  <PieChart>
                    <Pie
                      data={fieldDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey={(d: { value: string | number }) => Number(d.value)}
                      animationBegin={0}
                      animationDuration={800}
                      onMouseEnter={(_, index) => setHoveredIndex1(index)}
                      onMouseLeave={() => setHoveredIndex1(null)}
                    >
                      {fieldDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.fill || COLORS[index % COLORS.length]}
                          stroke={hoveredIndex1 === index ? "#ffffff" : "transparent"}
                          strokeWidth={hoveredIndex1 === index ? 3 : 0}
                          style={{
                            filter:
                              hoveredIndex1 === index
                                ? "brightness(1.1) drop-shadow(0 4px 8px rgba(0,0,0,0.2))"
                                : "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                            cursor: "pointer",
                            transition: "all 0.2s ease-in-out",
                          }}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="w-full max-w-xs">
                <div className="max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <div className="grid grid-cols-2 gap-1 pr-2">
                    {fieldDistribution.map((item, index) => (
                      <div
                        key={item.name}
                        className={`flex items-center gap-2 p-1.5 rounded-md transition-all duration-200 cursor-pointer hover:bg-gray-50 ${
                          hoveredIndex1 === index ? "bg-gray-50 scale-[1.02] shadow-sm" : ""
                        }`}
                        onMouseEnter={() => setHoveredIndex1(index)}
                        onMouseLeave={() => setHoveredIndex1(null)}
                      >
                        <div
                          className="w-2.5 h-2.5 rounded-full shadow-sm flex-shrink-0"
                          style={{ backgroundColor: item.fill || COLORS[index % COLORS.length] }}
                        />
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-xs font-medium text-gray-800 truncate">{item.name}</span>
                          <span className="text-xs text-gray-500">{item.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <h3 className="text-base font-medium text-gray-700 mb-4 text-center">라이브러리별 모델 분포</h3>
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative mb-4">
                <ResponsiveContainer width={200} height={200}>
                  <PieChart>
                    <Pie
                      data={libraryDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey={(d: { value: string | number }) => Number(d.value)}
                      animationBegin={0}
                      animationDuration={800}
                      onMouseEnter={(_, index) => setHoveredIndex2(index)}
                      onMouseLeave={() => setHoveredIndex2(null)}
                    >
                      {libraryDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.fill || COLORS[index % COLORS.length]}
                          stroke={hoveredIndex2 === index ? "#ffffff" : "transparent"}
                          strokeWidth={hoveredIndex2 === index ? 3 : 0}
                          style={{
                            filter:
                              hoveredIndex2 === index
                                ? "brightness(1.1) drop-shadow(0 4px 8px rgba(0,0,0,0.2))"
                                : "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                            cursor: "pointer",
                            transition: "all 0.2s ease-in-out",
                          }}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="w-full max-w-xs">
                <div className="max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <div className="grid grid-cols-2 gap-1 pr-2">
                    {libraryDistribution.map((item, index) => (
                      <div
                        key={item.name}
                        className={`flex items-center gap-2 p-1.5 rounded-md transition-all duration-200 cursor-pointer hover:bg-gray-50 ${
                          hoveredIndex2 === index ? "bg-gray-50 scale-[1.02] shadow-sm" : ""
                        }`}
                        onMouseEnter={() => setHoveredIndex2(index)}
                        onMouseLeave={() => setHoveredIndex2(null)}
                      >
                        <div
                          className="w-2.5 h-2.5 rounded-full shadow-sm flex-shrink-0"
                          style={{ backgroundColor: item.fill || COLORS[index % COLORS.length] }}
                        />
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-xs font-medium text-gray-800 truncate">{item.name}</span>
                          <span className="text-xs text-gray-500">{item.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
