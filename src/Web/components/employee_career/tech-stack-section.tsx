"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, Filter, ArrowUpDown, Map } from "lucide-react"
import Link from "next/link"

const techStacks = [
  { name: "React", level: 90 },
  { name: "TypeScript", level: 85 },
  { name: "Next.js", level: 80 },
  { name: "JavaScript", level: 95 },
  { name: "Tailwind CSS", level: 85 },
  { name: "Node.js", level: 70 },
  { name: "Git", level: 90 },
  { name: "Figma", level: 75 },
]

const getSkillColor = (level: number) => {
  if (level >= 90) return "bg-green-100 text-green-800 border-green-200"
  if (level >= 80) return "bg-[#F4B819]/10 text-[#F4B819] border-[#F4B819]/20"
  if (level >= 70) return "bg-blue-100 text-blue-800 border-blue-200"
  return "bg-gray-100 text-gray-700 border-gray-200"
}

export function TechStackSection() {
  const [sortBy, setSortBy] = useState<"name" | "level-high" | "level-low">("level-high")
  const [filterBy, setFilterBy] = useState<"all" | "expert" | "advanced" | "intermediate">("all")

  const sortedStacks = [...techStacks].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name)
    if (sortBy === "level-high") return b.level - a.level
    if (sortBy === "level-low") return a.level - b.level
    return 0
  })

  const filteredStacks = sortedStacks.filter((skill) => {
    if (filterBy === "expert") return skill.level >= 90
    if (filterBy === "advanced") return skill.level >= 80 && skill.level < 90
    if (filterBy === "intermediate") return skill.level >= 70 && skill.level < 80
    return true
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">기술 스택 & 숙련도</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 bg-transparent text-[#F4B819] border-[#F4B819] hover:bg-[#F4B819]/10"
              // onClick={() => window.open("https://roadmap.sh", "_blank")}
            >
              <Map className="h-3 w-3 mr-1" />
                <Link href="/employee_roadmap">로드맵</Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 bg-transparent">
                  <ArrowUpDown className="h-3 w-3 mr-1" />
                  정렬
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy("level-high")}>숙련도 높은 순</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("level-low")}>숙련도 낮은 순</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("name")}>이름 순</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 bg-transparent">
                  <Filter className="h-3 w-3 mr-1" />
                  필터
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilterBy("all")}>전체</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterBy("expert")}>전문가 (90%+)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterBy("advanced")}>숙련 (80-89%)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterBy("intermediate")}>중급 (70-79%)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {filteredStacks.map((skill) => (
            <span
              key={skill.name}
              className={`text-sm px-3 py-1.5 rounded-full border font-medium ${getSkillColor(skill.level)}`}
            >
              {skill.name}: {skill.level}%
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
