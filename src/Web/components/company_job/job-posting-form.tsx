"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Building2, MapPin, Clock, DollarSign } from "lucide-react"

interface JobPostingData {
  title: string
  company: string
  location: string
  type: string
  salary: string
  description: string
  requirements: string[]
  benefits: string[]
  department: string
  experience: string
}

export function JobPostingForm() {
  const [formData, setFormData] = useState<JobPostingData>({
    title: "",
    company: "",
    location: "",
    type: "",
    salary: "",
    description: "",
    requirements: [],
    benefits: [],
    department: "",
    experience: "",
  })

  const [newRequirement, setNewRequirement] = useState("")
  const [newBenefit, setNewBenefit] = useState("")

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()],
      }))
      setNewRequirement("")
    }
  }

  const removeRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }))
  }

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setFormData((prev) => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()],
      }))
      setNewBenefit("")
    }
  }

  const removeBenefit = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Job posting data:", formData)
    // Here you would typically send the data to your backend
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />새 채용 공고 작성
        </CardTitle>
        <CardDescription>상세한 정보를 입력하여 매력적인 채용 공고를 작성하세요</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">직무명 *</Label>
              <Input
                id="title"
                placeholder="예: 시니어 프론트엔드 개발자"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">회사명 *</Label>
              <Input
                id="company"
                placeholder="예: 테크 스타트업"
                value={formData.company}
                onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">근무지 *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="서울시 강남구"
                  className="pl-10"
                  value={formData.location}
                  onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">고용형태 *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                  <SelectValue placeholder="고용형태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="정규직">정규직</SelectItem>
                  <SelectItem value="계약직">계약직</SelectItem>
                  <SelectItem value="인턴">인턴</SelectItem>
                  <SelectItem value="프리랜서">프리랜서</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary">연봉</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="salary"
                  placeholder="5000만원 ~ 7000만원"
                  className="pl-10"
                  value={formData.salary}
                  onChange={(e) => setFormData((prev) => ({ ...prev, salary: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">부서</Label>
              <Input
                id="department"
                placeholder="예: 개발팀"
                value={formData.department}
                onChange={(e) => setFormData((prev) => ({ ...prev, department: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">경력</Label>
              <Select
                value={formData.experience}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, experience: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="경력 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="신입">신입</SelectItem>
                  <SelectItem value="1-3년">1-3년</SelectItem>
                  <SelectItem value="3-5년">3-5년</SelectItem>
                  <SelectItem value="5-10년">5-10년</SelectItem>
                  <SelectItem value="10년 이상">10년 이상</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <Label htmlFor="description">직무 설명 *</Label>
            <Textarea
              id="description"
              placeholder="이 직무에서 수행할 업무와 책임에 대해 자세히 설명해주세요..."
              className="min-h-[120px]"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>

          {/* Requirements */}
          <div className="space-y-4">
            <Label>자격 요건</Label>
            <div className="flex gap-2">
              <Input
                placeholder="자격 요건을 입력하세요"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
              />
              <Button type="button" onClick={addRequirement} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.requirements.map((req, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {req}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => removeRequirement(index)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            <Label>복리혜택</Label>
            <div className="flex gap-2">
              <Input
                placeholder="복리혜택을 입력하세요"
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addBenefit())}
              />
              <Button type="button" onClick={addBenefit} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.benefits.map((benefit, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  {benefit}
                  <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => removeBenefit(index)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-6">
            <Button type="submit" className="flex-1">
              공고 게시하기
            </Button>
            <Button type="button" variant="outline" className="flex-1 bg-transparent">
              임시저장
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
