"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import { JobCard } from "./job-card"
import { JobFilters } from "./job-filters"

const allJobRecommendations = [
  {
    id: 1,
    title: "시니어 프론트엔드 개발자",
    company: "네이버",
    location: "판교",
    salary: "6000-8000만원",
    type: "정규직",
    tags: ["React", "TypeScript", "Next.js"],
    matchRate: 95,
    postedDate: "2일 전",
    startDate: "2024-01-10",
    endDate: "2024-01-15",
    companySize: "대기업",
    workType: "하이브리드",
    experience: "5년 이상",
    description: "React와 TypeScript를 활용한 대규모 서비스 개발 경험이 있는 시니어 개발자를 찾습니다.",
  },
  {
    id: 2,
    title: "프론트엔드 개발자",
    company: "카카오",
    location: "판교",
    salary: "5000-7000만원",
    type: "정규직",
    tags: ["React", "JavaScript", "CSS"],
    matchRate: 88,
    postedDate: "1주 전",
    startDate: "2024-01-08",
    endDate: "2024-01-20",
    companySize: "대기업",
    workType: "재택근무",
    experience: "3년 이상",
    description: "사용자 경험을 중시하는 프론트엔드 개발자를 모집합니다.",
  },
  {
    id: 3,
    title: "React 개발자",
    company: "토스",
    location: "서울",
    salary: "5500-7500만원",
    type: "정규직",
    tags: ["React", "TypeScript", "Node.js"],
    matchRate: 92,
    postedDate: "3일 전",
    startDate: "2024-01-05",
    endDate: "2024-01-12",
    companySize: "중견기업",
    workType: "출근",
    experience: "4년 이상",
    description: "금융 서비스 개발에 참여할 React 전문 개발자를 찾습니다.",
  },
  {
    id: 4,
    title: "웹 프론트엔드 개발자",
    company: "쿠팡",
    location: "서울",
    salary: "4500-6500만원",
    type: "정규직",
    tags: ["React", "JavaScript", "Webpack"],
    matchRate: 85,
    postedDate: "5일 전",
    startDate: "2024-01-15",
    endDate: "2024-01-25",
    companySize: "대기업",
    workType: "하이브리드",
    experience: "2년 이상",
    description: "이커머스 플랫폼 개발에 참여할 프론트엔드 개발자를 모집합니다.",
  },
  {
    id: 5,
    title: "풀스택 개발자",
    company: "배달의민족",
    location: "서울",
    salary: "5000-7000만원",
    type: "정규직",
    tags: ["React", "Node.js", "MongoDB"],
    matchRate: 82,
    postedDate: "1주 전",
    startDate: "2024-01-12",
    endDate: "2024-01-18",
    companySize: "중견기업",
    workType: "하이브리드",
    experience: "3년 이상",
    description: "프론트엔드와 백엔드를 모두 다룰 수 있는 풀스택 개발자를 찾습니다.",
  },
  {
    id: 6,
    title: "주니어 프론트엔드 개발자",
    company: "라인",
    location: "판교",
    salary: "4000-5500만원",
    type: "정규직",
    tags: ["React", "TypeScript", "Vue.js"],
    matchRate: 78,
    postedDate: "4일 전",
    startDate: "2024-01-20",
    endDate: "2024-01-30",
    companySize: "대기업",
    workType: "출근",
    experience: "신입-2년",
    description: "성장 가능성이 높은 주니어 개발자를 모집합니다.",
  },
  {
    id: 7,
    title: "React Native 개발자",
    company: "당근마켓",
    location: "서울",
    salary: "5500-7000만원",
    type: "정규직",
    tags: ["React Native", "TypeScript", "JavaScript"],
    matchRate: 87,
    postedDate: "6일 전",
    startDate: "2024-01-16",
    endDate: "2024-01-22",
    companySize: "스타트업",
    workType: "재택근무",
    experience: "3년 이상",
    description: "모바일 앱 개발 경험이 있는 React Native 개발자를 찾습니다.",
  },
  {
    id: 8,
    title: "프론트엔드 엔지니어",
    company: "우아한형제들",
    location: "서울",
    salary: "5000-6500만원",
    type: "정규직",
    tags: ["React", "Redux", "Sass"],
    matchRate: 84,
    postedDate: "1주 전",
    startDate: "2024-01-10",
    endDate: "2024-01-16",
    companySize: "중견기업",
    workType: "하이브리드",
    experience: "3년 이상",
    description: "배달 서비스 플랫폼 개발에 참여할 프론트엔드 엔지니어를 모집합니다.",
  },
  {
    id: 9,
    title: "웹 개발자",
    company: "NHN",
    location: "판교",
    salary: "4800-6200만원",
    type: "정규직",
    tags: ["JavaScript", "Vue.js", "CSS"],
    matchRate: 79,
    postedDate: "3일 전",
    startDate: "2024-01-18",
    endDate: "2024-01-28",
    companySize: "대기업",
    workType: "출근",
    experience: "2년 이상",
    description: "다양한 웹 서비스 개발에 참여할 웹 개발자를 찾습니다.",
  },
  {
    id: 10,
    title: "시니어 풀스택 개발자",
    company: "삼성전자",
    location: "수원",
    salary: "7000-9000만원",
    type: "정규직",
    tags: ["React", "Node.js", "AWS"],
    matchRate: 93,
    postedDate: "1일 전",
    startDate: "2024-01-22",
    endDate: "2024-01-29",
    companySize: "대기업",
    workType: "하이브리드",
    experience: "7년 이상",
    description: "글로벌 서비스 개발을 위한 시니어 풀스택 개발자를 모집합니다.",
  },
  {
    id: 11,
    title: "프론트엔드 개발자",
    company: "야놀자",
    location: "서울",
    salary: "4500-6000만원",
    type: "정규직",
    tags: ["React", "TypeScript", "Styled-components"],
    matchRate: 86,
    postedDate: "2일 전",
    startDate: "2024-01-25",
    endDate: "2024-02-05",
    companySize: "중견기업",
    workType: "재택근무",
    experience: "3년 이상",
    description: "여행 플랫폼 서비스 개발에 참여할 프론트엔드 개발자를 찾습니다.",
  },
  {
    id: 12,
    title: "React 개발자",
    company: "마켓컬리",
    location: "서울",
    salary: "5200-6800만원",
    type: "정규직",
    tags: ["React", "Next.js", "GraphQL"],
    matchRate: 89,
    postedDate: "4일 전",
    startDate: "2024-01-20",
    endDate: "2024-01-27",
    companySize: "스타트업",
    workType: "하이브리드",
    experience: "4년 이상",
    description: "신선식품 이커머스 플랫폼 개발에 참여할 React 개발자를 모집합니다.",
  },
  {
    id: 13,
    title: "웹 프론트엔드 개발자",
    company: "LG전자",
    location: "서울",
    salary: "5500-7200만원",
    type: "정규직",
    tags: ["Vue.js", "JavaScript", "Webpack"],
    matchRate: 81,
    postedDate: "5일 전",
    startDate: "2024-01-15",
    endDate: "2024-01-22",
    companySize: "대기업",
    workType: "출근",
    experience: "3년 이상",
    description: "스마트 가전 웹 서비스 개발에 참여할 프론트엔드 개발자를 찾습니다.",
  },
  {
    id: 14,
    title: "주니어 개발자",
    company: "스포카",
    location: "서울",
    salary: "3800-5000만원",
    type: "정규직",
    tags: ["React", "Python", "Django"],
    matchRate: 75,
    postedDate: "1주 전",
    startDate: "2024-01-30",
    endDate: "2024-02-10",
    companySize: "스타트업",
    workType: "재택근무",
    experience: "신입-2년",
    description: "성장하는 스타트업에서 함께할 주니어 개발자를 모집합니다.",
  },
  {
    id: 15,
    title: "프론트엔드 엔지니어",
    company: "SK텔레콤",
    location: "서울",
    salary: "6000-8000만원",
    type: "정규직",
    tags: ["React", "TypeScript", "Redux"],
    matchRate: 91,
    postedDate: "3일 전",
    startDate: "2024-01-18",
    endDate: "2024-01-25",
    companySize: "대기업",
    workType: "하이브리드",
    experience: "5년 이상",
    description: "통신 서비스 플랫폼 개발에 참여할 프론트엔드 엔지니어를 찾습니다.",
  },
  {
    id: 16,
    title: "웹 개발자",
    company: "버즈빌",
    location: "서울",
    salary: "4800-6500만원",
    type: "정규직",
    tags: ["React", "Node.js", "MongoDB"],
    matchRate: 83,
    postedDate: "6일 전",
    startDate: "2024-01-12",
    endDate: "2024-01-19",
    companySize: "스타트업",
    workType: "출근",
    experience: "2년 이상",
    description: "광고 플랫폼 서비스 개발에 참여할 웹 개발자를 모집합니다.",
  },
  {
    id: 17,
    title: "시니어 React 개발자",
    company: "현대자동차",
    location: "서울",
    salary: "6500-8500만원",
    type: "정규직",
    tags: ["React", "TypeScript", "Docker"],
    matchRate: 88,
    postedDate: "2일 전",
    startDate: "2024-01-24",
    endDate: "2024-02-02",
    companySize: "대기업",
    workType: "하이브리드",
    experience: "6년 이상",
    description: "자동차 디지털 서비스 개발을 위한 시니어 React 개발자를 찾습니다.",
  },
  {
    id: 18,
    title: "프론트엔드 개발자",
    company: "컬리",
    location: "서울",
    salary: "5000-6800만원",
    type: "정규직",
    tags: ["React", "Next.js", "Tailwind"],
    matchRate: 87,
    postedDate: "1일 전",
    startDate: "2024-01-26",
    endDate: "2024-02-05",
    companySize: "중견기업",
    workType: "재택근무",
    experience: "3년 이상",
    description: "고객 경험을 개선할 프론트엔드 개발자를 모집합니다.",
  },
  {
    id: 19,
    title: "웹 프론트엔드 개발자",
    company: "KB국민은행",
    location: "서울",
    salary: "5800-7500만원",
    type: "정규직",
    tags: ["Vue.js", "JavaScript", "CSS"],
    matchRate: 80,
    postedDate: "4일 전",
    startDate: "2024-01-20",
    endDate: "2024-01-30",
    companySize: "대기업",
    workType: "출근",
    experience: "4년 이상",
    description: "디지털 뱅킹 서비스 개발에 참여할 프론트엔드 개발자를 찾습니다.",
  },
  {
    id: 20,
    title: "React Native 개발자",
    company: "직방",
    location: "서울",
    salary: "5500-7000만원",
    type: "정규직",
    tags: ["React Native", "TypeScript", "Redux"],
    matchRate: 85,
    postedDate: "5일 전",
    startDate: "2024-01-15",
    endDate: "2024-01-25",
    companySize: "중견기업",
    workType: "하이브리드",
    experience: "3년 이상",
    description: "부동산 플랫폼 모바일 앱 개발에 참여할 React Native 개발자를 모집합니다.",
  },
  {
    id: 21,
    title: "풀스택 개발자",
    company: "뱅크샐러드",
    location: "서울",
    salary: "5200-6800만원",
    type: "정규직",
    tags: ["React", "Node.js", "PostgreSQL"],
    matchRate: 84,
    postedDate: "3일 전",
    startDate: "2024-01-22",
    endDate: "2024-01-29",
    companySize: "스타트업",
    workType: "재택근무",
    experience: "4년 이상",
    description: "핀테크 서비스 개발을 위한 풀스택 개발자를 찾습니다.",
  },
  {
    id: 22,
    title: "프론트엔드 개발자",
    company: "신한은행",
    location: "서울",
    salary: "5500-7200만원",
    type: "정규직",
    tags: ["Angular", "TypeScript", "RxJS"],
    matchRate: 77,
    postedDate: "1주 전",
    startDate: "2024-01-28",
    endDate: "2024-02-07",
    companySize: "대기업",
    workType: "출근",
    experience: "3년 이상",
    description: "모바일 뱅킹 서비스 개발에 참여할 프론트엔드 개발자를 모집합니다.",
  },
  {
    id: 23,
    title: "시니어 웹 개발자",
    company: "넥슨",
    location: "판교",
    salary: "6800-8800만원",
    type: "정규직",
    tags: ["React", "TypeScript", "WebGL"],
    matchRate: 90,
    postedDate: "2일 전",
    startDate: "2024-01-25",
    endDate: "2024-02-01",
    companySize: "대기업",
    workType: "하이브리드",
    experience: "6년 이상",
    description: "게임 웹 플랫폼 개발을 위한 시니어 웹 개발자를 찾습니다.",
  },
  {
    id: 24,
    title: "프론트엔드 개발자",
    company: "무신사",
    location: "서울",
    salary: "4800-6200만원",
    type: "정규직",
    tags: ["React", "Next.js", "Emotion"],
    matchRate: 86,
    postedDate: "4일 전",
    startDate: "2024-01-20",
    endDate: "2024-01-28",
    companySize: "중견기업",
    workType: "재택근무",
    experience: "3년 이상",
    description: "패션 이커머스 플랫폼 개발에 참여할 프론트엔드 개발자를 찾습니다.",
  },
]

export function JobRecommendations() {
  const [displayCount, setDisplayCount] = useState(6)
  const [sortBy, setSortBy] = useState("matchRate")
  const [filterBy, setFilterBy] = useState("all")

  const filteredAndSortedJobs = allJobRecommendations
    .filter((job) => {
      if (filterBy === "all") return true
      if (filterBy === "high-match") return job.matchRate >= 90
      if (filterBy === "대기업") return job.companySize === "대기업"
      if (filterBy === "스타트업") return job.companySize === "스타트업"
      if (filterBy === "remote") return job.workType === "재택근무"
      return true
    })
    .sort((a, b) => {
      if (sortBy === "matchRate") return b.matchRate - a.matchRate
      if (sortBy === "salary") return Number.parseInt(b.salary.split("-")[1]) - Number.parseInt(a.salary.split("-")[1])
      if (sortBy === "deadline") return new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
      if (sortBy === "company") return a.company.localeCompare(b.company)
      return 0
    })

  const displayedJobs = filteredAndSortedJobs.slice(0, displayCount)
  const hasMoreJobs = displayCount < filteredAndSortedJobs.length

  const loadMoreJobs = () => {
    setDisplayCount((prev) => Math.min(prev + 6, filteredAndSortedJobs.length))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold flex items-center">
              <Star className="w-5 h-5 mr-2 text-primary" />
              맞춤 채용 공고
            </CardTitle>
            <p className="text-sm text-muted-foreground">당신의 기술 스택과 경력에 맞는 추천 공고입니다</p>
          </div>
          <JobFilters sortBy={sortBy} filterBy={filterBy} onSortChange={setSortBy} onFilterChange={setFilterBy} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        {hasMoreJobs && (
          <div className="mt-6">
            <Button variant="outline" className="w-full bg-transparent" onClick={loadMoreJobs}>
              더 많은 공고 보기 ({filteredAndSortedJobs.length - displayCount}개 더)
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
