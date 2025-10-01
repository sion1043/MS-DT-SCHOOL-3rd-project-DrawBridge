"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FilterPanel } from "@/components/employee_skillfit/filter-panel"
import { IntegratedCareerChart } from "@/components/employee_skillfit/integrated-career-chart"
import { SimilarProfiles } from "@/components/employee_skillfit/similar-profiles"
import { TrendingSkills } from "@/components/employee_skillfit/trending-skills"
import { RoadmapLinks } from "@/components/employee_skillfit/roadmap-links"
import { PersonalSkills } from "@/components/employee_skillfit/personal-skills"

export function CareerDashboard() {
  const [filters, setFilters] = useState({
    position: "",
    techStack: [],
    companyType: "",
    experience: [0, 10],
    salary: [0, 200000],
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">개발자 커리어 로드맵</h1>
              <p className="text-muted-foreground mt-1">채용공고 시장 분석 및 커리어 가이드</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">마지막 업데이트: 2025년 09월</div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filter Panel */}
          <div className="lg:col-span-1">
            <FilterPanel filters={filters} onFiltersChange={setFilters} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">

            {/* Personal Skills */}
            <PersonalSkills />

            
            {/* Additional Features */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">비슷한 구직자 스택</CardTitle>
                </CardHeader>
                <CardContent>
                  <SimilarProfiles filters={filters} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">트렌딩 기술 스택</CardTitle>
                </CardHeader>
                <CardContent>
                  <TrendingSkills />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">학습 로드맵</CardTitle>
                </CardHeader>
                <CardContent>
                  <RoadmapLinks filters={filters} />
                </CardContent>
              </Card>
            </div>

            {/* Main Charts */}
            <div className="w-full">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">연차별 연봉 & 기술 스택 분포</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    차트 위에 마우스를 올려각 연차별 평균 연봉과 기술 스택 분포를 확인하세요.
{/*                     
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                      {["React", "Vue", "Python", "Java", "Node.js", "TypeScript", "AWS", "Docker"].map((tech, index) => (
                        <div key={tech} className="flex items-center gap-2 text-xs">
                          <div
                            className="w-3 h-3 rounded-sm"
                            style={{
                              backgroundColor: [
                                "#61DAFB",
                                "#4FC08D",
                                "#3776AB",
                                "#ED8B00",
                                "#339933",
                                "#3178C6",
                                "#FF9900",
                                "#2496ED",
                              ][index],
                            }}
                          />
                          <span className="text-muted-foreground">{tech}</span>
                        </div>
                      ))}
                    </div> */}
                  </p>
                </CardHeader>
                <CardContent>
                  <IntegratedCareerChart filters={filters} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
