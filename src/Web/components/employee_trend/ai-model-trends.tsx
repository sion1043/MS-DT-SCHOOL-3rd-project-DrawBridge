"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowDown, Heart, ExternalLink, Loader2 } from "lucide-react"
import { useApi } from "@/hooks/employee_trend/use-api"
import type { AIModel } from "@/types/employee_trend"

export function AIModelTrends() {
  const [displayCount, setDisplayCount] = useState(5)
  const [sortBy, setSortBy] = useState<"default" | "downloads" | "likes">("default")

  const { data: models, loading, error, refetch } = useApi<AIModel[]>(
    `/api/employee_trend/ai-models?limit=${displayCount}`
  )

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 1
    const clampedValue = Math.max(1, Math.min(value, 50)) // 최대 50개로 제한
    setDisplayCount(clampedValue)
  }

  const handleModelClick = (model: AIModel) => {
    // 실제 링크가 있다면 사용, 없다면 Hugging Face 기본 링크 생성
    const link = `https://huggingface.co/${model.name}`
    window.open(link, "_blank", "noopener,noreferrer")
  }

  const parseNumber = (str: string): number => {
    const num = Number.parseFloat(str.replace(/[KM]/g, ""))
    if (str.includes("K")) return num * 1000
    if (str.includes("M")) return num * 1000000
    return num
  }

  if (loading) {
    return (
      <Card className="bg-white border-gray-200 h-[600px] flex flex-col">
        <CardContent className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-white border-gray-200 h-[600px] flex flex-col">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center space-y-2">
            <p className="text-destructive">데이터를 불러오는데 실패했습니다: {error}</p>
            <Button onClick={refetch} variant="outline" size="sm">
              다시 시도
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!models || models.length === 0) {
    return (
      <Card className="bg-white border-gray-200 h-[600px] flex flex-col">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">데이터가 없습니다.</p>
        </CardContent>
      </Card>
    )
  }

  const sortedModels = [...models].sort((a, b) => {
    if (sortBy === "downloads") {
      return parseNumber(b.downloads) - parseNumber(a.downloads)
    }
    if (sortBy === "likes") {
      return parseNumber(b.likes) - parseNumber(a.likes)
    }
    return 0 // default order
  })

  return (
    <Card className="bg-white border-gray-200 h-[600px] flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">⚠</span>
            </div>
            <CardTitle className="text-base font-semibold text-gray-800">인기 모델 순위</CardTitle>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-600">개수:</span>
            <Input
              type="number"
              min="1"
              max="100"
              value={displayCount}
              onChange={handleCountChange}
              className="w-14 h-7 text-xs text-center"
            />
            <span className="text-xs text-gray-500">/100</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-gray-600">
            {sortBy === "downloads"
              ? "다운로드 수 기준 정렬"
              : sortBy === "likes"
                ? "좋아요 수 기준 정렬"
                : "이번 주 가장 인기있는 AI 모델"}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant={sortBy === "downloads" ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs px-2"
              onClick={() => setSortBy(sortBy === "downloads" ? "default" : "downloads")}
            >
              <ArrowDown className="h-3 w-3 mr-1" />
              다운로드
            </Button>
            <Button
              variant={sortBy === "likes" ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs px-2"
              onClick={() => setSortBy(sortBy === "likes" ? "default" : "likes")}
            >
              <Heart className="h-3 w-3 mr-1" />
              좋아요
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden pt-0">
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="space-y-2.5 pr-2">
            {sortedModels.map((model, index) => (
              <div
                key={model.id}
                onClick={() => handleModelClick(model)}
                className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-yellow-100 text-yellow-600 font-bold text-xs">
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-medium text-gray-900 text-xs group-hover:text-blue-600 transition-colors">
                        {model.name}
                      </h3>
                      <ExternalLink className="h-2.5 w-2.5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <div className="flex flex-col space-y-0.5 mt-0.5">
                      <div className="flex items-center space-x-1.5">
                        <Badge
                          variant="outline"
                          className="text-xs px-1 py-0 bg-blue-50 text-blue-600 border-blue-200 text-[10px]"
                        >
                          {model.pipeline_tag}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-xs px-1 py-0 bg-green-50 text-green-600 border-green-200 text-[10px]"
                        >
                          {model.library_name}
                        </Badge>
                      </div>
                      <span className="text-[10px] text-gray-500">{model.author}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-1 text-[10px] text-gray-500">
                  <div className="flex items-center">
                    <ArrowDown className="h-2.5 w-2.5 mr-0.5" />
                    {model.downloads}
                  </div>
                  <div className="flex items-center">
                    <Heart className="h-2.5 w-2.5 mr-0.5" />
                    {model.likes}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
