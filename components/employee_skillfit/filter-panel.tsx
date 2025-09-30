"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"

interface FilterPanelProps {
  filters: {
    position: string
    techStack: string[]
    companyType: string
    experience: number[]
    salary: number[]
  }
  onFiltersChange: (filters: any) => void
}

export function FilterPanel({ filters, onFiltersChange }: FilterPanelProps) {
  const positions = ["프론트엔드", "백엔드", "풀스택", "데이터 사이언티스트", "DevOps", "모바일"]
  const techStacks = [
    "React",
    "Vue",
    "Angular",
    "Node.js",
    "Python",
    "Java",
    "Spring",
    "Django",
    "MySQL",
    "PostgreSQL",
    "MongoDB",
    "AWS",
    "Docker",
    "Kubernetes",
  ]
  const companyTypes = ["스타트업", "중견기업", "대기업", "외국계", "공공기관"]

  const handleTechStackChange = (tech: string, checked: boolean) => {
    const newTechStack = checked ? [...filters.techStack, tech] : filters.techStack.filter((t) => t !== tech)

    onFiltersChange({ ...filters, techStack: newTechStack })
  }

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="text-lg">필터</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Position Filter */}
        <div className="space-y-2">
          <Label>직무</Label>
          <Select value={filters.position} onValueChange={(value) => onFiltersChange({ ...filters, position: value })}>
            <SelectTrigger>
              <SelectValue placeholder="직무 선택" />
            </SelectTrigger>
            <SelectContent>
              {positions.map((position) => (
                <SelectItem key={position} value={position}>
                  {position}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tech Stack Filter */}
        <div className="space-y-3">
          <Label>기술 스택</Label>
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
            {techStacks.map((tech) => (
              <div key={tech} className="flex items-center space-x-2">
                <Checkbox
                  id={tech}
                  checked={filters.techStack.includes(tech)}
                  onCheckedChange={(checked) => handleTechStackChange(tech, checked as boolean)}
                />
                <Label htmlFor={tech} className="text-sm">
                  {tech}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Company Type Filter */}
        <div className="space-y-2">
          <Label>기업 형태</Label>
          <Select
            value={filters.companyType}
            onValueChange={(value) => onFiltersChange({ ...filters, companyType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="기업 형태 선택" />
            </SelectTrigger>
            <SelectContent>
              {companyTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Experience Filter */}
        <div className="space-y-3">
          <Label>
            경력 ({filters.experience[0]}년 - {filters.experience[1]}년)
          </Label>
          <Slider
            value={filters.experience}
            onValueChange={(value) => onFiltersChange({ ...filters, experience: value })}
            max={15}
            min={0}
            step={1}
            className="w-full"
          />
        </div>

        {/* Salary Filter */}
        <div className="space-y-3">
          <Label>
            연봉 ({filters.salary[0].toLocaleString()}만원 - {filters.salary[1].toLocaleString()}만원)
          </Label>
          <Slider
            value={filters.salary}
            onValueChange={(value) => onFiltersChange({ ...filters, salary: value })}
            max={20000}
            min={0}
            step={500}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  )
}
