"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  FileText,
  Calendar,
  Download,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Award,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
} from "recharts"
import { useState } from "react"

export function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("6months")
  const [selectedMetric, setSelectedMetric] = useState("applications")

  const monthlyData = [
    { month: "1월", applications: 45, interviews: 12, hires: 3, views: 890, conversion: 5.1 },
    { month: "2월", applications: 52, interviews: 15, hires: 4, views: 1020, conversion: 5.1 },
    { month: "3월", applications: 38, interviews: 10, hires: 2, views: 750, conversion: 5.1 },
    { month: "4월", applications: 61, interviews: 18, hires: 5, views: 1180, conversion: 5.2 },
    { month: "5월", applications: 48, interviews: 14, hires: 3, views: 920, conversion: 5.2 },
    { month: "6월", applications: 55, interviews: 16, hires: 4, views: 1050, conversion: 5.2 },
  ]

  const departmentData = [
    { name: "개발팀", applications: 156, hires: 12, color: "#F4B819" },
    { name: "디자인팀", applications: 89, hires: 6, color: "#8B5CF6" },
    { name: "마케팅팀", applications: 54, hires: 3, color: "#10B981" },
  ]

  const sourceData = [
    { source: "직접 지원", count: 120, percentage: 40.1 },
    { source: "채용 사이트", count: 89, percentage: 29.8 },
    { source: "추천", count: 56, percentage: 18.7 },
    { source: "소셜미디어", count: 34, percentage: 11.4 },
  ]

  const topJobs = [
    { title: "프론트엔드 개발자", applications: 89, views: 1240, interviews: 25, hires: 6 },
    { title: "백엔드 개발자", applications: 76, views: 980, interviews: 22, hires: 4 },
    { title: "UI/UX 디자이너", applications: 45, views: 650, interviews: 12, hires: 3 },
    { title: "데이터 분석가", applications: 32, views: 420, interviews: 8, hires: 2 },
  ]

  const performanceMetrics = [
    { metric: "평균 채용 기간", value: "28일", change: -3, trend: "down" },
    { metric: "면접 참석률", value: "87%", change: 5, trend: "up" },
    { metric: "제안 수락률", value: "73%", change: 8, trend: "up" },
    { metric: "채용 비용", value: "₩2.4M", change: -12, trend: "down" },
  ]

  const chartConfig = {
    applications: {
      label: "지원자",
      color: "#F4B819",
    },
    interviews: {
      label: "면접",
      color: "#8B5CF6",
    },
    hires: {
      label: "채용",
      color: "#10B981",
    },
    views: {
      label: "조회수",
      color: "#3B82F6",
    },
  }

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === "up" || change > 0) {
      return <TrendingUp className="h-3 w-3 text-green-600" />
    }
    return <TrendingDown className="h-3 w-3 text-red-600" />
  }

  const getTrendColor = (trend: string, change: number) => {
    if (trend === "up" || change > 0) {
      return "text-green-600"
    }
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                채용 분석 대시보드
              </CardTitle>
              <CardDescription>채용 성과와 트렌드를 한눈에 확인하세요</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">최근 1개월</SelectItem>
                  <SelectItem value="3months">최근 3개월</SelectItem>
                  <SelectItem value="6months">최근 6개월</SelectItem>
                  <SelectItem value="1year">최근 1년</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                리포트 다운로드
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">총 지원자</p>
                <p className="text-2xl font-bold">299</p>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">+12%</span>
                  <span className="text-muted-foreground">전월 대비</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-[#F4B819]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">공고 조회수</p>
                <p className="text-2xl font-bold">3,290</p>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">+8%</span>
                  <span className="text-muted-foreground">전월 대비</span>
                </div>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">면접 진행</p>
                <p className="text-2xl font-bold">85</p>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingDown className="h-3 w-3 text-red-600" />
                  <span className="text-red-600">-3%</span>
                  <span className="text-muted-foreground">전월 대비</span>
                </div>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">최종 채용</p>
                <p className="text-2xl font-bold">21</p>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">+5%</span>
                  <span className="text-muted-foreground">전월 대비</span>
                </div>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{metric.metric}</p>
                <p className="text-xl font-bold">{metric.value}</p>
                <div className="flex items-center gap-1 text-sm">
                  {getTrendIcon(metric.trend, metric.change)}
                  <span className={getTrendColor(metric.trend, metric.change)}>
                    {metric.change > 0 ? "+" : ""}
                    {metric.change}%
                  </span>
                  <span className="text-muted-foreground">전월 대비</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            트렌드 분석
          </TabsTrigger>
          <TabsTrigger value="funnel" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            채용 퍼널
          </TabsTrigger>
          <TabsTrigger value="departments" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            부서별 분석
          </TabsTrigger>
          <TabsTrigger value="sources" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            유입 경로
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>월별 채용 현황</CardTitle>
                <CardDescription>최근 6개월간 지원자 및 채용 현황</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ChartContainer config={chartConfig} className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar dataKey="applications" fill="var(--color-chart-1)" name="지원자" />
                        <Bar dataKey="interviews" fill="var(--color-chart-2)" name="면접" />
                        <Bar dataKey="hires" fill="var(--color-chart-3)" name="채용" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>조회수 및 전환율 추이</CardTitle>
                <CardDescription>공고 조회수와 지원 전환율 변화</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ChartContainer config={chartConfig} className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar yAxisId="left" dataKey="views" fill="var(--color-chart-4)" name="조회수" />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="conversion"
                          stroke="var(--color-chart-1)"
                          strokeWidth={3}
                          name="전환율(%)"
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="funnel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>채용 성공률 분석</CardTitle>
              <CardDescription>단계별 전환율 및 성공률</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">지원서 접수</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">299명</span>
                    <Badge variant="secondary">100%</Badge>
                  </div>
                </div>
                <Progress value={100} className="h-3" />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">서류 통과</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">85명</span>
                    <Badge variant="secondary">28.4%</Badge>
                  </div>
                </div>
                <Progress value={28.4} className="h-3" />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">면접 진행</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">45명</span>
                    <Badge variant="secondary">15.1%</Badge>
                  </div>
                </div>
                <Progress value={15.1} className="h-3" />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">최종 채용</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">21명</span>
                    <Badge className="bg-[#F4B819] text-black">7.0%</Badge>
                  </div>
                </div>
                <Progress value={7.0} className="h-3" />
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">개선 제안</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 서류 통과율이 28.4%로 업계 평균(35%)보다 낮습니다</li>
                  <li>• 면접 참석률 향상을 위한 일정 조율 개선이 필요합니다</li>
                  <li>• 최종 채용률 7.0%는 양호한 수준입니다</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>부서별 지원자 분포</CardTitle>
                <CardDescription>각 부서별 지원자 현황</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ChartContainer config={chartConfig} className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={departmentData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="applications"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {departmentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>부서별 채용 성과</CardTitle>
                <CardDescription>부서별 지원자 대비 채용 현황</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {departmentData.map((dept, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{dept.name}</span>
                      <div className="text-right">
                        <span className="text-sm text-muted-foreground">
                          {dept.hires}/{dept.applications}
                        </span>
                        <span className="ml-2 font-bold">{((dept.hires / dept.applications) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                    <Progress
                      value={(dept.hires / dept.applications) * 100}
                      className="h-2"
                      style={{ "--progress-background": dept.color } as React.CSSProperties}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>지원자 유입 경로</CardTitle>
                <CardDescription>채널별 지원자 유입 현황</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ChartContainer config={chartConfig} className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={sourceData}
                        layout="horizontal"
                        margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="source" type="category" width={80} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" fill="var(--color-chart-1)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>채널별 효율성</CardTitle>
                <CardDescription>유입 경로별 상세 분석</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {sourceData.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{source.source}</h4>
                      <p className="text-sm text-muted-foreground">{source.count}명 지원</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{source.percentage}%</p>
                      <p className="text-sm text-muted-foreground">전체 대비</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>인기 공고 분석</CardTitle>
          <CardDescription>공고별 조회수 및 지원자 현황</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topJobs.map((job, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F4B819]/10 text-[#F4B819] font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold">{job.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        조회 {job.views.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        지원 {job.applications}명
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        면접 {job.interviews}명
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        채용 {job.hires}명
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">전환율</p>
                  <p className="font-bold">{((job.applications / job.views) * 100).toFixed(1)}%</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
