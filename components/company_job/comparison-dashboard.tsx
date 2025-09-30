"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { TrendingUp, TrendingDown, Eye, Users, Clock, Building2, MapPin, DollarSign } from "lucide-react"

// Mock data for comparison
const mockCompanyPosts = [
  {
    id: 1,
    title: "프론트엔드 개발자",
    department: "개발팀",
    postedDate: "2024-01-15",
    views: 1250,
    applications: 45,
    salary: "5000-7000만원",
    location: "서울 강남구",
    type: "정규직",
  },
  {
    id: 2,
    title: "백엔드 개발자",
    department: "개발팀",
    postedDate: "2024-01-10",
    views: 980,
    applications: 32,
    salary: "5500-7500만원",
    location: "서울 서초구",
    type: "정규직",
  },
]

const mockCompetitorPosts = [
  {
    id: 1,
    company: "네이버",
    title: "프론트엔드 개발자",
    views: 2100,
    applications: 78,
    salary: "6000-8000만원",
    location: "경기 분당구",
    type: "정규직",
    benefits: ["재택근무", "점심제공", "교육비지원"],
  },
  {
    id: 2,
    company: "카카오",
    title: "프론트엔드 개발자",
    views: 1890,
    applications: 65,
    salary: "5800-7800만원",
    location: "제주도",
    type: "정규직",
    benefits: ["유연근무", "건강검진", "휴가비지원"],
  },
]

const performanceData = [
  { name: "1월", 우리회사: 45, 경쟁사평균: 62 },
  { name: "2월", 우리회사: 52, 경쟁사평균: 58 },
  { name: "3월", 우리회사: 38, 경쟁사평균: 71 },
  { name: "4월", 우리회사: 61, 경쟁사평균: 65 },
]

const viewsData = [
  { name: "1주", 우리회사: 1200, 경쟁사평균: 1800 },
  { name: "2주", 우리회사: 1350, 경쟁사평균: 1950 },
  { name: "3주", 우리회사: 1100, 경쟁사평균: 2100 },
  { name: "4주", 우리회사: 1450, 경쟁사평균: 1750 },
]

export function ComparisonDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">경쟁사 비교 분석</h2>
          <p className="text-muted-foreground">자사 공고와 경쟁사 공고를 비교하여 개선점을 찾아보세요</p>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="posts">공고 비교</TabsTrigger>
          <TabsTrigger value="performance">성과 분석</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">평균 조회수</p>
                    <p className="text-2xl font-bold">1,115</p>
                  </div>
                  <Eye className="h-8 w-8 text-primary" />
                </div>
                <div className="flex items-center mt-2">
                  <TrendingDown className="h-4 w-4 text-destructive mr-1" />
                  <span className="text-sm text-destructive">-23% vs 경쟁사</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">평균 지원자수</p>
                    <p className="text-2xl font-bold">39</p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div className="flex items-center mt-2">
                  <TrendingDown className="h-4 w-4 text-destructive mr-1" />
                  <span className="text-sm text-destructive">-35% vs 경쟁사</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">지원 전환율</p>
                    <p className="text-2xl font-bold">3.5%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-primary mr-1" />
                  <span className="text-sm text-primary">+12% vs 경쟁사</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">평균 게시기간</p>
                    <p className="text-2xl font-bold">18일</p>
                  </div>
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-destructive mr-1" />
                  <span className="text-sm text-destructive">+5일 vs 경쟁사</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>월별 지원자 수 비교</CardTitle>
                <CardDescription>최근 4개월간 지원자 수 추이</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="우리회사" fill="hsl(var(--primary))" />
                    <Bar dataKey="경쟁사평균" fill="hsl(var(--secondary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>주별 조회수 비교</CardTitle>
                <CardDescription>최근 4주간 조회수 추이</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={viewsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="우리회사" stroke="hsl(var(--primary))" strokeWidth={2} />
                    <Line type="monotone" dataKey="경쟁사평균" stroke="hsl(var(--secondary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="posts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Our Company Posts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  우리 회사 공고
                </CardTitle>
                <CardDescription>최근 게시된 채용 공고</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockCompanyPosts.map((post) => (
                  <div key={post.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{post.title}</h4>
                        <p className="text-sm text-muted-foreground">{post.department}</p>
                      </div>
                      <Badge variant="outline">{post.type}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{post.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>{post.salary}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {post.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {post.applications}명 지원
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">{post.postedDate}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Competitor Posts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-secondary" />
                  경쟁사 공고
                </CardTitle>
                <CardDescription>유사한 직무의 경쟁사 공고</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockCompetitorPosts.map((post) => (
                  <div key={post.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{post.title}</h4>
                        <p className="text-sm text-muted-foreground">{post.company}</p>
                      </div>
                      <Badge variant="secondary">{post.type}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{post.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>{post.salary}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {post.benefits.map((benefit, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {post.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {post.applications}명 지원
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>성과 지표 상세 분석</CardTitle>
                <CardDescription>각 지표별 경쟁사 대비 성과</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">조회수 성과</span>
                    <span className="text-sm text-muted-foreground">77% (경쟁사 대비)</span>
                  </div>
                  <Progress value={77} className="h-2" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">지원자 수</span>
                    <span className="text-sm text-muted-foreground">65% (경쟁사 대비)</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">지원 전환율</span>
                    <span className="text-sm text-muted-foreground">112% (경쟁사 대비)</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">공고 완성도</span>
                    <span className="text-sm text-muted-foreground">85% (경쟁사 대비)</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>개선 우선순위</CardTitle>
                <CardDescription>즉시 개선이 필요한 영역</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-destructive/10 rounded-lg">
                  <div className="w-2 h-2 bg-destructive rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">급여 정보</p>
                    <p className="text-xs text-muted-foreground">경쟁사 대비 낮음</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-secondary/10 rounded-lg">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">복리혜택</p>
                    <p className="text-xs text-muted-foreground">구체성 부족</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">직무 설명</p>
                    <p className="text-xs text-muted-foreground">개선 권장</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
