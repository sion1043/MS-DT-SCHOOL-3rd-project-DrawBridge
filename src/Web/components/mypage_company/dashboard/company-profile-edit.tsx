"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building2, Upload, Save, X } from "lucide-react"

interface CompanyInfo {
  name: string
  industry: string
  tier: string
  xp: number
  email: string
  phone: string
  location: string
  founded: string
  description?: string
  website?: string
  employeeCount?: string
  logo?: string
}

interface CompanyProfileEditProps {
  companyInfo: CompanyInfo
  onSave: (updatedInfo: CompanyInfo) => void
  onCancel: () => void
}

export function CompanyProfileEdit({ companyInfo, onSave, onCancel }: CompanyProfileEditProps) {
  const [formData, setFormData] = useState<CompanyInfo>({
    ...companyInfo,
    description: companyInfo.description || "혁신적인 기술로 더 나은 세상을 만들어가는 IT 스타트업입니다.",
    website: companyInfo.website || "https://techstartup.com",
    employeeCount: companyInfo.employeeCount || "50-100명",
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: keyof CompanyInfo, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onSave(formData)
    setIsLoading(false)
  }

  const industries = [
    "IT 서비스",
    "소프트웨어 개발",
    "전자상거래",
    "핀테크",
    "게임",
    "교육",
    "헬스케어",
    "제조업",
    "금융",
    "기타",
  ]

  const employeeCounts = ["1-10명", "11-50명", "51-100명", "101-500명", "501-1000명", "1000명 이상"]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            회사 정보 수정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Company Logo and Basic Info */}
          <div className="flex items-start gap-6">
            <div className="flex flex-col items-center gap-3">
              <Avatar className="w-24 h-24">
                <AvatarImage src={formData.logo || "/placeholder.svg?height=96&width=96"} />
                <AvatarFallback className="text-2xl font-bold bg-[#F4B819] text-black">
                  {formData.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                <Upload className="h-4 w-4" />
                로고 변경
              </Button>
            </div>

            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">회사명 *</Label>
                  <Input
                    id="company-name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="회사명을 입력하세요"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">업종 *</Label>
                  <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="업종을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">회사 소개</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="회사에 대한 간단한 소개를 작성해주세요"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일 *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="contact@company.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">전화번호 *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="02-1234-5678"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">웹사이트</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                placeholder="https://company.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">위치 *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="서울, 대한민국"
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="founded">설립일 *</Label>
              <Input
                id="founded"
                value={formData.founded}
                onChange={(e) => handleInputChange("founded", e.target.value)}
                placeholder="2020.03.15"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employee-count">직원 수</Label>
              <Select
                value={formData.employeeCount}
                onValueChange={(value) => handleInputChange("employeeCount", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="직원 수를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {employeeCounts.map((count) => (
                    <SelectItem key={count} value={count}>
                      {count}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Current Status Display */}
          <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <Badge className="bg-[#F4B819] text-black">{formData.tier}</Badge>
              <span className="text-sm text-muted-foreground">현재 등급</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{formData.xp} XP</span>
              <span className="text-sm text-muted-foreground">경험치</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onCancel} disabled={isLoading}>
              <X className="h-4 w-4 mr-2" />
              취소
            </Button>
            <Button onClick={handleSave} disabled={isLoading} className="bg-[#F4B819] text-black hover:bg-[#F4B819]/90">
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "저장 중..." : "저장"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
