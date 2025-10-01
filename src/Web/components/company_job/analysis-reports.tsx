"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Target,
  FileText,
  BarChart3,
  Zap,
  Building2,
} from "lucide-react"

interface AnalysisItem {
  category: string
  score: number
  status: "good" | "warning" | "critical"
  description: string
  recommendation: string
}

const mockAnalysis: AnalysisItem[] = [
  {
    category: "제목 매력도",
    score: 75,
    status: "good",
    description: "직무명이 명확하고 검색에 최적화되어 있습니다.",
    recommendation: "시니어, 주니어 등 경력 레벨을 명시하면 더 좋습니다.",
  },
  {
    category: "급여 경쟁력",
    score: 45,
    status: "critical",
    description: "경쟁사 대비 급여 수준이 낮습니다.",
    recommendation: "시장 평균 대비 15-20% 상향 조정을 권장합니다.",
  },
  {
    category: "복리혜택",
    score: 60,
    status: "warning",
    description: "기본적인 혜택은 제공하지만 차별화 요소가 부족합니다.",
    recommendation: "재택근무, 교육비 지원 등 트렌드에 맞는 혜택 추가를 권장합니다.",
  },
  {
    category: "직무 설명",
    score: 85,
    status: "good",
    description: "구체적이고 명확한 직무 설명이 작성되었습니다.",
    recommendation: "성장 기회와 커리어 패스를 추가하면 더욱 매력적입니다.",
  },
]

const improvementSuggestions = [
  {
    priority: "high",
    title: "급여 범위 상향 조정",
    description: "현재 급여 범위가 시장 평균보다 15% 낮습니다. 경쟁력 확보를 위해 상향 조정이 필요합니다.",
    impact: "지원자 수 30-40% 증가 예상",
    effort: "즉시 적용 가능",
  },
  {
    priority: "medium",
    title: "복리혜택 구체화",
    description: "재택근무, 유연근무제, 교육비 지원 등 구체적인 혜택을 명시하세요.",
    impact: "지원 전환율 20% 향상 예상",
    effort: "내용 수정 필요",
  },
  {
    priority: "low",
    title: "회사 문화 소개",
    description: "팀 분위기, 성장 기회, 회사 비전 등을 추가하여 브랜딩을 강화하세요.",
    impact: "브랜드 인지도 향상",
    effort: "콘텐츠 작성 필요",
  },
]

const competitorInsights = [
  {
    company: "네이버",
    strength: "높은 급여와 브랜드 파워",
    weakness: "높은 업무 강도",
    opportunity: "워라밸 강조로 차별화 가능",
  },
  {
    company: "카카오",
    strength: "유연한 근무 환경",
    weakness: "상대적으로 낮은 급여",
    opportunity: "급여 경쟁력으로 우위 확보 가능",
  },
]

export function AnalysisReports() {
  const [selectedTab, setSelectedTab] = useState("analysis")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    setTimeout(() => setIsAnalyzing(false), 2000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "critical":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI 분석 리포트
          </CardTitle>
          <CardDescription>AI가 분석한 채용 공고의 경쟁력과 개선 방안을 확인하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">72</div>
                <div className="text-sm text-muted-foreground">종합 점수</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">B+</div>
                <div className="text-sm text-muted-foreground">등급</div>
              </div>
            </div>
            <Button onClick={handleAnalyze} disabled={isAnalyzing}>
              {isAnalyzing ? (
                <>
                  <Zap className="h-4 w-4 mr-2 animate-spin" />
                  분석 중...
                </>
              ) : (
                <>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  재분석하기
                </>
              )}
            </Button>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="analysis">상세 분석</TabsTrigger>
              <TabsTrigger value="suggestions">개선 제안</TabsTrigger>
              <TabsTrigger value="competitors">경쟁사 인사이트</TabsTrigger>
            </TabsList>

            <TabsContent value="analysis" className="space-y-4 mt-6">
              {mockAnalysis.map((item, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status)}
                      <h4 className="font-semibold">{item.category}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${getStatusColor(item.status)}`}>{item.score}점</span>
                    </div>
                  </div>

                  <Progress value={item.score} className="h-2" />

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                      <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{item.recommendation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="suggestions" className="space-y-4 mt-6">
              {improvementSuggestions.map((suggestion, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold">{suggestion.title}</h4>
                    </div>
                    <Badge className={getPriorityColor(suggestion.priority)}>
                      {suggestion.priority === "high" ? "높음" : suggestion.priority === "medium" ? "보통" : "낮음"}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">{suggestion.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm">
                        <strong>예상 효과:</strong> {suggestion.impact}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">
                        <strong>작업량:</strong> {suggestion.effort}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="competitors" className="space-y-4 mt-6">
              {competitorInsights.map((insight, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    {insight.company}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-green-600">강점</p>
                      <p className="text-sm text-muted-foreground">{insight.strength}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-red-600">약점</p>
                      <p className="text-sm text-muted-foreground">{insight.weakness}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-primary">기회</p>
                      <p className="text-sm text-muted-foreground">{insight.opportunity}</p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-primary mb-2">핵심 인사이트</h4>
                    <p className="text-sm text-muted-foreground">
                      경쟁사들은 높은 급여나 유연한 근무환경 중 하나에 집중하고 있습니다. 두 요소를 모두 강화하면
                      차별화된 경쟁력을 확보할 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
