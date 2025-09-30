"use client"

import useSWRInfinite from "swr/infinite"
import { useEffect, useRef, useMemo, useState } from "react"
import { Search, Bookmark, Mail, MapPin, Star, Filter, BarChart3, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Header } from "@/components/header"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

// ** DB에서 데이터 가져오기 위해 새롭게 정의한 부분**
// API 응답 타입
type CandidatesPage = {
  candidates: Candidate[]; // 너의 기존 Candidate 인터페이스 재사용
  nextCursor: { cursorTs: string; cursorId: string } | null;
  hasMore: boolean;
};
const fetcher = (url: string) => fetch(url).then((r) => r.json());
const LIMIT = 2;
// 각 페이지 요청 URL 만들기
const getKey = (index: number, prev: CandidatesPage | null) => {
  if (prev && !prev.hasMore) return null; // 더 없음
  if (index === 0) return `/api/company_monitor/candidates?limit=${LIMIT}`;
  const c = prev?.nextCursor;
  if (!c) return null;
  const qs = new URLSearchParams({
    limit: String(LIMIT),
    cursorTs: c.cursorTs,
    cursorId: c.cursorId,
  });
  return `/api/company_monitor/candidates?${qs.toString()}`;
};
// ** DB에서 데이터 가져오기 위해 새롭게 정의한 부분**

interface Candidate {
  id: string
  name: string
  photo: string
  location: string
  skillStack: string[]
  skillLevel: "Junior" | "Mid" | "Senior"
  experience: string
  rating: number
  isBookmarked: boolean
}

const mockCandidates: Candidate[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    photo: "/professional-woman-developer.png",
    location: "San Francisco, CA",
    skillStack: ["React", "TypeScript", "Node.js"],
    skillLevel: "Senior",
    experience: "5+ years",
    rating: 4.8,
    isBookmarked: false,
  },
  {
    id: "2",
    name: "Michael Chen",
    photo: "/professional-man-developer.png",
    location: "New York, NY",
    skillStack: ["Python", "Django", "PostgreSQL"],
    skillLevel: "Mid",
    experience: "3 years",
    rating: 4.6,
    isBookmarked: true,
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    photo: "/professional-woman-designer.png",
    location: "Austin, TX",
    skillStack: ["UI/UX", "Figma", "React"],
    skillLevel: "Senior",
    experience: "6+ years",
    rating: 4.9,
    isBookmarked: false,
  },
  {
    id: "4",
    name: "David Kim",
    photo: "/professional-engineer.png",
    location: "Seattle, WA",
    skillStack: ["Java", "Spring", "AWS"],
    skillLevel: "Mid",
    experience: "4 years",
    rating: 4.5,
    isBookmarked: false,
  },
]

const mockAnalyticsData = [
  { month: "Jan", applications: 45, interviews: 12, hires: 3 },
  { month: "Feb", applications: 52, interviews: 15, hires: 4 },
  { month: "Mar", applications: 38, interviews: 10, hires: 2 },
  { month: "Apr", applications: 61, interviews: 18, hires: 5 },
  { month: "May", applications: 49, interviews: 14, hires: 4 },
  { month: "Jun", applications: 67, interviews: 20, hires: 6 },
]

const mockSkillProgressionData = {
  "1": {
    name: "Sarah Johnson",
    skillProgression: [
      { month: "Jan", React: 85, TypeScript: 80, "Node.js": 75 },
      { month: "Feb", React: 87, TypeScript: 82, "Node.js": 78 },
      { month: "Mar", React: 90, TypeScript: 85, "Node.js": 80 },
      { month: "Apr", React: 92, TypeScript: 88, "Node.js": 83 },
      { month: "May", React: 94, TypeScript: 90, "Node.js": 85 },
      { month: "Jun", React: 96, TypeScript: 92, "Node.js": 88 },
    ],
  },
  "2": {
    name: "Michael Chen",
    skillProgression: [
      { month: "Jan", Python: 78, Django: 72, PostgreSQL: 70 },
      { month: "Feb", Python: 80, Django: 75, PostgreSQL: 73 },
      { month: "Mar", Python: 83, Django: 78, PostgreSQL: 76 },
      { month: "Apr", Python: 85, Django: 80, PostgreSQL: 78 },
      { month: "May", Python: 88, Django: 83, PostgreSQL: 81 },
      { month: "Jun", Python: 90, Django: 85, PostgreSQL: 84 },
    ],
  },
  "3": {
    name: "Emily Rodriguez",
    skillProgression: [
      { month: "Jan", "UI/UX": 90, Figma: 88, React: 82 },
      { month: "Feb", "UI/UX": 91, Figma: 90, React: 84 },
      { month: "Mar", "UI/UX": 93, Figma: 92, React: 86 },
      { month: "Apr", "UI/UX": 94, Figma: 93, React: 88 },
      { month: "May", "UI/UX": 96, Figma: 95, React: 90 },
      { month: "Jun", "UI/UX": 97, Figma: 96, React: 92 },
    ],
  },
  "4": {
    name: "David Kim",
    skillProgression: [
      { month: "Jan", Java: 75, Spring: 70, AWS: 68 },
      { month: "Feb", Java: 78, Spring: 73, AWS: 71 },
      { month: "Mar", Java: 80, Spring: 76, AWS: 74 },
      { month: "Apr", Java: 83, Spring: 78, AWS: 77 },
      { month: "May", Java: 85, Spring: 81, AWS: 80 },
      { month: "Jun", Java: 88, Spring: 84, AWS: 83 },
    ],
  },
}

export default function CompanyDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [requiredSkills, setRequiredSkills] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [analyticsData, setAnalyticsData] = useState(mockAnalyticsData)
  const [showSkillAnalysis, setShowSkillAnalysis] = useState(false)
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null)
  
  // // change to useSWRInfinite
  // const [candidates, setCandidates] = useState(mockCandidates)
  // const handleBookmark = (candidateId: string) => {
  //   setCandidates((prev) =>
  //     prev.map((candidate) =>
  //       candidate.id === candidateId ? { ...candidate, isBookmarked: !candidate.isBookmarked } : candidate,
  //     ),
  //   )
  // }

  // ** DB에서 데이터 가져오기 위해 새롭게 정의한 부분**
  // 북마크는 클라에서만 관리 (필요하면 나중에 API로 저장)
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const { data, error, size, setSize, isValidating } =
    useSWRInfinite<CandidatesPage>(getKey, fetcher, { revalidateOnFocus: false });
  const apiCandidates = (data ?? []).flatMap((p) => p.candidates);
  // API 데이터 + 북마크 병합
  const candidates = useMemo(
    () => apiCandidates.map((c) => ({ ...c, isBookmarked: bookmarked.has(c.id) })),
    [apiCandidates, bookmarked]
  );
  // 기존 핸들러 대체
  const handleBookmark = (candidateId: string) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      next.has(candidateId) ? next.delete(candidateId) : next.add(candidateId);
      return next;
    });
  };
  // 무한스크롤 센티널 추가
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const hasMore = data?.[data.length - 1]?.hasMore ?? true;
  useEffect(() => {
    if (!hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && setSize((s) => s + 1),
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, setSize]);
  // ** DB에서 데이터 가져오기 위해 새롭게 정의한 부분**


  const handleSendOffer = (candidateName: string) => {
    // In a real app, this would send an email
    alert(`Interview offer sent to ${candidateName}!`)
  }

  const addFilter = (filter: string) => {
    if (!selectedFilters.includes(filter)) {
      setSelectedFilters([...selectedFilters, filter])
    }
  }

  const removeFilter = (filter: string) => {
    setSelectedFilters(selectedFilters.filter((f) => f !== filter))
  }

  const handleShowAnalytics = async () => {
    // Simulate fetching data from database
    console.log("[v0] Fetching analytics data from database...")

    // In a real app, this would be an API call to your database
    // const response = await fetch('/api/analytics')
    // const data = await response.json()
    // setAnalyticsData(data)

    setShowAnalytics(true)
  }

  const handleShowSkillAnalysis = async (candidateId: string) => {
    console.log("[v0] Fetching skill progression data from database for candidate:", candidateId)

    // In a real app, this would be an API call to your database
    // const response = await fetch(`/api/candidates/${candidateId}/skill-progression`)
    // const data = await response.json()

    setSelectedCandidateId(candidateId)
    setShowSkillAnalysis(true)
  }

  const getSelectedCandidateData = () => {
    if (!selectedCandidateId) return null
    return mockSkillProgressionData[selectedCandidateId as keyof typeof mockSkillProgressionData]
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Header with Search */}
      <div className="border-b bg-white p-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Company Dashboard</h1>
            <Button onClick={handleShowAnalytics} className="bg-[#F4B819] text-black hover:bg-[#E5A617]">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search candidates by name, skills, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
            <div className="w-80 relative">
              <Input
                placeholder="Required skills..."
                value={requiredSkills}
                onChange={(e) => setRequiredSkills(e.target.value)}
                className="h-12"
              />
            </div>
          </div>

          {/* Filter Tags */}
          {selectedFilters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedFilters.map((filter) => (
                <Badge
                  key={filter}
                  variant="secondary"
                  className="bg-[#F4B819] text-black hover:bg-[#E5A617] cursor-pointer"
                  onClick={() => removeFilter(filter)}
                >
                  #{filter} ×
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={showAnalytics} onOpenChange={setShowAnalytics}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Recruitment Analytics
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">312</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Interviews Scheduled</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89</div>
                  <p className="text-xs text-muted-foreground">+8% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Successful Hires</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">+15% from last month</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Application Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analyticsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="applications"
                        stroke="#F4B819"
                        strokeWidth={2}
                        name="Applications"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Hiring Funnel</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="applications" fill="#F4B819" name="Applications" />
                      <Bar dataKey="interviews" fill="#E5A617" name="Interviews" />
                      <Bar dataKey="hires" fill="#D4941A" name="Hires" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Individual Skill Analysis Modal */}
      <Dialog open={showSkillAnalysis} onOpenChange={setShowSkillAnalysis}>
        <DialogContent className="max-w-7xl w-[95vw] max-h-[90vh] overflow-y-auto resize-both min-w-[800px] min-h-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Skill Proficiency Analysis - {getSelectedCandidateData()?.name}
            </DialogTitle>
          </DialogHeader>

          {getSelectedCandidateData() && (
            <div className="space-y-6">
              {/* Skill Improvement Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.keys(getSelectedCandidateData()!.skillProgression[0])
                  .filter((key) => key !== "month")
                  .map((skill) => {
                    const candidateData = getSelectedCandidateData()!
                    const firstMonthData = candidateData.skillProgression[0]
                    const lastMonthData = candidateData.skillProgression[candidateData.skillProgression.length - 1]

                    const firstMonth = Number(firstMonthData[skill as keyof typeof firstMonthData] ?? 0)
                    const lastMonth =  Number(lastMonthData[skill as keyof typeof lastMonthData] ?? 0)                    
                    const improvement = lastMonth - firstMonth

                    return (
                      <Card key={skill}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">{skill}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{lastMonth}%</div>
                          <p className="text-xs text-green-600">+{improvement}% improvement</p>
                        </CardContent>
                      </Card>
                    )
                  })}
              </div>

              {/* Skill Progression Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Skill Progression Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={getSelectedCandidateData()!.skillProgression}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      {Object.keys(getSelectedCandidateData()!.skillProgression[0])
                        .filter((key) => key !== "month")
                        .map((skill, index) => {
                          const colors = [
                            "#F4B819",
                            "#E5A617",
                            "#10B981",
                            "#10B981",
                            "#8B5CF6",
                            "#F4B819",
                            "#06B6D4",
                            "#F97316",
                          ]
                          return (
                            <Line
                              key={skill}
                              type="monotone"
                              dataKey={skill}
                              stroke={colors[index]}
                              strokeWidth={2}
                              name={skill}
                            />
                          )
                        })}
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Skill Comparison Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Current vs Previous Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={(() => {
                        const candidateData = getSelectedCandidateData()!
                        const skills = Object.keys(candidateData.skillProgression[0]).filter((key) => key !== "month")
                        const firstAssessment = candidateData.skillProgression[0]
                        const lastAssessment = candidateData.skillProgression[candidateData.skillProgression.length - 1]

                        return skills.slice(0, 3).map((skill) => ({
                          skill,
                          previous: Number(firstAssessment[skill as keyof typeof firstAssessment] ?? 0),
                          current: Number(lastAssessment[skill as keyof typeof lastAssessment] ?? 0),
                        }))
                      })()}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="skill" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="previous" fill="#E5A617" name="Previous Assessment" />
                      <Bar dataKey="current" fill="#F4B819" name="Current Assessment" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Skill Level Progression - Interactive Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Skill Level Progression - Interactive Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {(() => {
                      const candidateData = getSelectedCandidateData()!
                      const skills = Object.keys(candidateData.skillProgression[0]).filter((key) => key !== "month")
                      const firstAssessment = candidateData.skillProgression[0]
                      const lastAssessment = candidateData.skillProgression[candidateData.skillProgression.length - 1]

                      const extendedSkills = [
                        ...skills,
                        "Problem Solving",
                        "Code Quality",
                        "Team Collaboration",
                        "Technical Communication",
                        "Project Management",
                      ]

                      return extendedSkills.map((skill, index) => {
                        // Generate realistic skill data for extended skills
                        const previousLevel =
                          skill in firstAssessment
                            ? Number(firstAssessment[skill as keyof typeof firstAssessment])
                            : Math.floor(Math.random() * 30) + 60 // Random between 60-90

                        const currentLevel =
                          skill in lastAssessment
                            ? Number(lastAssessment[skill as keyof typeof lastAssessment])
                            : previousLevel + Math.floor(Math.random() * 20) + 5 // Improvement of 5-25 points

                        const companyRequiredLevels = [85, 80, 75, 90, 70, 88, 82, 78]
                        const companyRequired = companyRequiredLevels[index % companyRequiredLevels.length]

                        const clampedPreviousLevel = Math.min(previousLevel, 100)
                        const clampedCurrentLevel = Math.min(currentLevel, 100)
                        const improvement = clampedCurrentLevel - clampedPreviousLevel

                        const colors = [
                          { current: "#F59E0B" }, // Orange
                          { current: "#3B82F6" }, // Blue
                          { current: "#10B981" }, // Green
                          { current: "#10B981" }, // Green (different shade)
                          { current: "#8B5CF6" }, // Purple
                          { current: "#F59E0B" }, // Orange
                          { current: "#06B6D4" }, // Cyan
                          { current: "#F97316" }, // Orange
                        ]

                        const colorSet = colors[index % colors.length]

                        return (
                          <div key={skill} className="space-y-3">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium text-sm">{skill}</h4>
                              <div className="flex items-center gap-4 text-xs">
                                <span className="flex items-center gap-2">
                                  <div className="w-4 h-4 rounded border bg-gray-500"></div>
                                  <span className="font-medium text-gray-600">Past: {clampedPreviousLevel}%</span>
                                </span>
                                <span className="flex items-center gap-2">
                                  <div
                                    className="w-4 h-4 rounded border"
                                    style={{ backgroundColor: colorSet.current }}
                                  ></div>
                                  <span className="font-medium text-gray-900">Current: {clampedCurrentLevel}%</span>
                                </span>
                                <span className="flex items-center gap-2">
                                  <div className="w-4 h-4 rounded border border-2 border-red-500 bg-red-100"></div>
                                  <span className="font-medium text-red-700">Required: {companyRequired}%</span>
                                </span>
                                <span className={`font-bold ${improvement >= 0 ? "text-green-600" : "text-red-600"}`}>
                                  {improvement >= 0 ? "+" : ""}
                                  {improvement}%
                                </span>
                              </div>
                            </div>

                            <div className="relative">
                              <div className="relative h-8 bg-gray-100 rounded-full border overflow-hidden group cursor-pointer">
                                {/* Past level - full width background segment */}
                                <div
                                  className="absolute top-0 left-0 h-full rounded-full transition-all duration-300 flex items-center justify-center group-hover:bg-gray-600"
                                  style={{
                                    width: `${clampedPreviousLevel}%`,
                                    backgroundColor: "#9CA3AF", // Uniform dark gray for all past levels
                                  }}
                                >
                                  <span className="text-xs font-bold text-white drop-shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {clampedPreviousLevel}%
                                  </span>
                                </div>

                                {/* Current level - overlapping segment */}
                                <div
                                  className="absolute top-0 left-0 h-full rounded-full transition-all duration-300 flex items-center justify-center"
                                  style={{
                                    width: `${clampedCurrentLevel}%`,
                                    backgroundColor: colorSet.current,
                                  }}
                                >
                                  <span className="text-xs font-bold text-white drop-shadow-sm">
                                    {clampedCurrentLevel}%
                                  </span>
                                </div>

                                {/* Company required level marker */}
                                <div
                                  className="absolute top-0 h-full w-1 bg-red-500 border-l-2 border-red-600 z-10"
                                  style={{
                                    left: `${companyRequired}%`,
                                  }}
                                  title={`Company Required: ${companyRequired}%`}
                                >
                                  <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 border-2 border-red-600 rounded-full"></div>
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-between items-center text-xs px-1">
                              <div className="flex justify-between text-muted-foreground font-medium flex-1">
                                <span>Beginner (0-25)</span>
                                <span>Intermediate (26-50)</span>
                                <span>Advanced (51-75)</span>
                                <span>Expert (76-100)</span>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    })()}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="mx-auto max-w-7xl p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Filters */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="h-5 w-5" />
                  <h2 className="text-lg font-semibold">Filters</h2>
                </div>

                <div className="space-y-6">
                  {/* Job Posting */}
                  <div>
                    <h3 className="font-medium mb-3">Job Posting</h3>
                    <Select onValueChange={(value) => addFilter(`job-${value}`)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select job posting" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="frontend">Frontend Developer</SelectItem>
                        <SelectItem value="backend">Backend Developer</SelectItem>
                        <SelectItem value="fullstack">Full Stack Developer</SelectItem>
                        <SelectItem value="designer">UI/UX Designer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Career Level */}
                  <div>
                    <h3 className="font-medium mb-3">Career Level</h3>
                    <div className="space-y-2">
                      {["Junior", "Mid", "Senior", "Lead"].map((level) => (
                        <div key={level} className="flex items-center space-x-2">
                          <Checkbox
                            id={level}
                            onCheckedChange={(checked) => {
                              if (checked) addFilter(level.toLowerCase())
                              else removeFilter(level.toLowerCase())
                            }}
                          />
                          <label htmlFor={level} className="text-sm cursor-pointer">
                            {level}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Region */}
                  <div>
                    <h3 className="font-medium mb-3">Region</h3>
                    <Select onValueChange={(value) => addFilter(`region-${value}`)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="west-coast">West Coast</SelectItem>
                        <SelectItem value="east-coast">East Coast</SelectItem>
                        <SelectItem value="midwest">Midwest</SelectItem>
                        <SelectItem value="south">South</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Skill Stack */}
                  <div>
                    <h3 className="font-medium mb-3">Skill Stack</h3>
                    <div className="space-y-2">
                      {["React", "TypeScript", "Python", "Java", "AWS", "Docker"].map((skill) => (
                        <div key={skill} className="flex items-center space-x-2">
                          <Checkbox
                            id={skill}
                            onCheckedChange={(checked) => {
                              if (checked) addFilter(skill.toLowerCase())
                              else removeFilter(skill.toLowerCase())
                            }}
                          />
                          <label htmlFor={skill} className="text-sm cursor-pointer">
                            {skill}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Candidate Cards */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {candidates.map((candidate) => (
                <Card key={candidate.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 flex items-start gap-4">
                        <img
                          src={candidate.photo || "/placeholder.svg"}
                          alt={candidate.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-1">{candidate.name}</h3>
                          <div className="flex items-center gap-1 text-muted-foreground mb-2">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm">{candidate.location}</span>
                          </div>
                          <div className="flex items-center gap-1 mb-3">
                            <Star className="h-4 w-4 fill-[#F4B819] text-[#F4B819]" />
                            <span className="text-sm font-medium">{candidate.rating}</span>
                            <span className="text-sm text-muted-foreground">• {candidate.experience}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-4">
                            {candidate.skillStack.map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          <Badge
                            variant="secondary"
                            className={`text-xs ${
                              candidate.skillLevel === "Senior"
                                ? "bg-green-100 text-green-800"
                                : candidate.skillLevel === "Mid"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {candidate.skillLevel} Level
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShowSkillAnalysis(candidate.id)}
                        className="shrink-0"
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Skill Analysis
                      </Button>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBookmark(candidate.id)}
                        className={`flex-1 ${
                          candidate.isBookmarked ? "bg-[#F4B819] text-black hover:bg-[#E5A617]" : ""
                        }`}
                      >
                        <Bookmark className={`h-4 w-4 mr-2 ${candidate.isBookmarked ? "fill-current" : ""}`} />
                        {candidate.isBookmarked ? "Saved" : "Save"}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSendOffer(candidate.name)}
                        className="flex-1 bg-[#F4B819] text-black hover:bg-[#E5A617]"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Send Offer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {/* **DB에서 데이터 가져오기 위해 새롭게 정의한 부분** */}
              <div ref={sentinelRef} className="py-6 text-center text-gray-500">
                {isValidating ? "Loading..." : hasMore ? "Scroll to load more" : "No more"}
              </div>
              {/* **DB에서 데이터 가져오기 위해 새롭게 정의한 부분** */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
