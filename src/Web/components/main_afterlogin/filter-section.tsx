"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

const jobCategories = [
  { name: "개발/IT", count: 1234 },
  { name: "디자인", count: 567 },
  { name: "마케팅", count: 890 },
  { name: "영업", count: 432 },
  { name: "기획", count: 321 },
  { name: "운영", count: 654 },
  { name: "의료", count: 234 },
  { name: "물류", count: 345 },
]

const skills = [
  "React",
  "JavaScript",
  "Python",
  "Java",
  "Node.js",
  "TypeScript",
  "Vue.js",
  "Angular",
  "Spring",
  "Django",
  "AWS",
  "Docker",
  "Kubernetes",
  "MySQL",
  "PostgreSQL",
  "MongoDB",
  "Git"
]

const locations = ["서울", "경기", "인천", "부산", "대구", "광주", "대전", "울산"]

export function FilterSection() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
  }

  return (
    <Card className="w-full h-full sticky top-6">
      <CardHeader>
        <CardTitle className="text-xl">맞춤 검색 필터</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 검색창 */}
        <div className="relative">
          <Input
            placeholder="직무, 회사명, 키워드를 검색하세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 text-base"
          />
        </div>

        {/* 직무 카테고리 */}
        <div className="space-y-3">
          <h3 className="font-semibold text-base">직무 분야</h3>
          <div className="grid grid-cols-2 gap-2">
            {jobCategories.map((category) => {
              return (
                <Button
                  key={category.name}
                  variant={selectedCategory === category.name ? "default" : "outline"}
                  className="h-16 p-3 flex flex-col items-center gap-1 hover:scale-105 transition-transform text-sm"
                  onClick={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
                >
                  <span className="font-medium">{category.name}</span>
                  <span className="text-xs text-muted-foreground">{category.count.toLocaleString()}건</span>
                </Button>
              )
            })}
          </div>
        </div>

        {/* 스킬 태그 */}
        <div className="space-y-3">
          <h3 className="font-semibold text-base">기술 스택</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge
                key={skill}
                variant={selectedSkills.includes(skill) ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/10 transition-colors px-3 py-1 text-xs"
                onClick={() => toggleSkill(skill)}
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* 지역 선택 */}
        <div className="space-y-3">
          <h3 className="font-semibold text-base">근무 지역</h3>
          <div className="grid grid-cols-2 gap-2">
            {locations.map((location) => (
              <Button
                key={location}
                variant={selectedLocation === location ? "default" : "outline"}
                className="py-2 text-sm"
                onClick={() => setSelectedLocation(selectedLocation === location ? null : location)}
              >
                {location}
              </Button>
            ))}
          </div>
        </div>

        {/* 검색 버튼 */}
        <div className="flex gap-3 pt-4">
          <Button className="flex-1 h-11" size="lg">
            검색하기
          </Button>
          <Button
            variant="outline"
            className="h-11 px-6 bg-transparent"
            size="lg"
            onClick={() => {
              setSelectedCategory(null)
              setSelectedSkills([])
              setSelectedLocation(null)
              setSearchQuery("")
            }}
          >
            초기화
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
