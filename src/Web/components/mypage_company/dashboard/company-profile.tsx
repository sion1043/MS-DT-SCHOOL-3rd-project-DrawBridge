"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  MapPin,
  Globe,
  Users,
  Calendar,
  Building2,
  Phone,
  Mail,
  Edit,
  Save,
  X,
  Plus,
  Upload,
  Camera,
  Award,
  Target,
  Heart,
  Briefcase,
  GraduationCap,
  Coffee,
  Car,
  Home,
  Zap,
} from "lucide-react"
import { useState } from "react"

export function CompanyProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const [isLogoDialogOpen, setIsLogoDialogOpen] = useState(false)
  const [newBenefit, setNewBenefit] = useState("")
  const [newValue, setNewValue] = useState("")

  const [companyData, setCompanyData] = useState({
    name: "테크 이노베이션",
    industry: "IT/소프트웨어",
    employees: "50-100명",
    founded: "2018년",
    location: "서울, 대한민국",
    detailedAddress: "서울시 강남구 테헤란로 123, 테크타워 15층",
    website: "www.techinnovation.co.kr",
    phone: "02-1234-5678",
    email: "hr@techinnovation.co.kr",
    ceo: "김기술",
    capital: "50억원",
    revenue: "100억원",
    logo: "/generic-company-logo.png",
    description:
      "혁신적인 기술로 더 나은 세상을 만들어가는 IT 기업입니다. 클라우드, AI, 빅데이터 분야에서 선도적인 솔루션을 제공하며, 창의적이고 도전적인 인재를 찾고 있습니다.",
    vision: "기술로 세상을 더 편리하고 안전하게 만드는 것",
    mission: "혁신적인 IT 솔루션으로 고객의 성공을 돕는 것",
    values: ["혁신", "협업", "성장", "고객중심"],
    benefits: [
      { name: "4대보험", icon: "shield", category: "보험" },
      { name: "연차 15일", icon: "calendar", category: "휴가" },
      { name: "교육비 지원", icon: "graduation", category: "교육" },
      { name: "야근수당", icon: "clock", category: "수당" },
      { name: "점심 제공", icon: "coffee", category: "식사" },
      { name: "자율 출퇴근", icon: "clock", category: "근무" },
      { name: "주차 지원", icon: "car", category: "편의" },
      { name: "재택근무", icon: "home", category: "근무" },
    ],
    culture: {
      workStyle: "수평적 조직문화",
      atmosphere: "자유롭고 창의적인 분위기",
      growth: "개인 성장을 위한 다양한 기회 제공",
      collaboration: "팀워크와 소통을 중시하는 문화",
    },
  })

  const handleSave = () => {
    setIsEditing(false)
    console.log("Saving company data:", companyData)
    // 실제 저장 로직 구현
  }

  const handleCancel = () => {
    setIsEditing(false)
    // 원래 데이터로 복원하는 로직
  }

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setCompanyData({
        ...companyData,
        benefits: [
          ...companyData.benefits,
          {
            name: newBenefit,
            icon: "zap",
            category: "기타",
          },
        ],
      })
      setNewBenefit("")
    }
  }

  const removeBenefit = (index: number) => {
    setCompanyData({
      ...companyData,
      benefits: companyData.benefits.filter((_, i) => i !== index),
    })
  }

  const addValue = () => {
    if (newValue.trim()) {
      setCompanyData({
        ...companyData,
        values: [...companyData.values, newValue],
      })
      setNewValue("")
    }
  }

  const removeValue = (index: number) => {
    setCompanyData({
      ...companyData,
      values: companyData.values.filter((_, i) => i !== index),
    })
  }

  const getBenefitIcon = (iconName: string) => {
    const icons = {
      shield: Award,
      calendar: Calendar,
      graduation: GraduationCap,
      clock: Calendar,
      coffee: Coffee,
      car: Car,
      home: Home,
      zap: Zap,
    }
    const IconComponent = icons[iconName as keyof typeof icons] || Zap
    return <IconComponent className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              회사 프로필 관리
            </CardTitle>
            <CardDescription>회사 정보를 체계적으로 관리하고 구직자에게 어필하세요</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave} className="bg-[#F4B819] hover:bg-[#F4B819]/90 text-black">
                  <Save className="h-4 w-4 mr-2" />
                  저장
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  취소
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                편집
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            기본 정보
          </TabsTrigger>
          <TabsTrigger value="culture" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            기업 문화
          </TabsTrigger>
          <TabsTrigger value="benefits" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            복리후생
          </TabsTrigger>
          <TabsTrigger value="vision" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            비전/가치
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>회사 로고 및 기본 정보</CardTitle>
              <CardDescription>구직자에게 첫인상을 주는 중요한 정보입니다</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={companyData.logo || "/placeholder.svg"} alt="Company Logo" />
                    <AvatarFallback className="text-2xl font-bold bg-[#F4B819]/10 text-[#F4B819]">
                      {companyData.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Dialog open={isLogoDialogOpen} onOpenChange={setIsLogoDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-transparent"
                          variant="outline"
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>회사 로고 변경</DialogTitle>
                          <DialogDescription>새로운 로고 이미지를 업로드하세요</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                            <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground mb-2">이미지를 드래그하거나 클릭하여 업로드</p>
                            <p className="text-xs text-muted-foreground">PNG, JPG 파일 (최대 2MB)</p>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsLogoDialogOpen(false)}>
                            취소
                          </Button>
                          <Button className="bg-[#F4B819] hover:bg-[#F4B819]/90 text-black">업로드</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="space-y-2">
                    <Label>회사명</Label>
                    {isEditing ? (
                      <Input
                        value={companyData.name}
                        onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                        className="text-xl font-bold"
                      />
                    ) : (
                      <h2 className="text-2xl font-bold">{companyData.name}</h2>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>업종</Label>
                  {isEditing ? (
                    <Select
                      value={companyData.industry}
                      onValueChange={(value) => setCompanyData({ ...companyData, industry: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IT/소프트웨어">IT/소프트웨어</SelectItem>
                        <SelectItem value="제조업">제조업</SelectItem>
                        <SelectItem value="금융업">금융업</SelectItem>
                        <SelectItem value="서비스업">서비스업</SelectItem>
                        <SelectItem value="유통업">유통업</SelectItem>
                        <SelectItem value="건설업">건설업</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      {companyData.industry}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>직원 수</Label>
                  {isEditing ? (
                    <Select
                      value={companyData.employees}
                      onValueChange={(value) => setCompanyData({ ...companyData, employees: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10명">1-10명</SelectItem>
                        <SelectItem value="11-50명">11-50명</SelectItem>
                        <SelectItem value="51-100명">51-100명</SelectItem>
                        <SelectItem value="101-300명">101-300명</SelectItem>
                        <SelectItem value="301-500명">301-500명</SelectItem>
                        <SelectItem value="500명 이상">500명 이상</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {companyData.employees}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>설립년도</Label>
                  {isEditing ? (
                    <Input
                      value={companyData.founded}
                      onChange={(e) => setCompanyData({ ...companyData, founded: e.target.value })}
                    />
                  ) : (
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {companyData.founded}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>대표자</Label>
                  {isEditing ? (
                    <Input
                      value={companyData.ceo}
                      onChange={(e) => setCompanyData({ ...companyData, ceo: e.target.value })}
                    />
                  ) : (
                    <p>{companyData.ceo}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>자본금</Label>
                  {isEditing ? (
                    <Input
                      value={companyData.capital}
                      onChange={(e) => setCompanyData({ ...companyData, capital: e.target.value })}
                    />
                  ) : (
                    <p>{companyData.capital}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>매출액</Label>
                  {isEditing ? (
                    <Input
                      value={companyData.revenue}
                      onChange={(e) => setCompanyData({ ...companyData, revenue: e.target.value })}
                    />
                  ) : (
                    <p>{companyData.revenue}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>위치</Label>
                  {isEditing ? (
                    <Input
                      value={companyData.location}
                      onChange={(e) => setCompanyData({ ...companyData, location: e.target.value })}
                    />
                  ) : (
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {companyData.location}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>웹사이트</Label>
                  {isEditing ? (
                    <Input
                      value={companyData.website}
                      onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                    />
                  ) : (
                    <p className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <a href={`https://${companyData.website}`} className="text-[#F4B819] hover:underline">
                        {companyData.website}
                      </a>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>전화번호</Label>
                  {isEditing ? (
                    <Input
                      value={companyData.phone}
                      onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                    />
                  ) : (
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {companyData.phone}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>이메일</Label>
                  {isEditing ? (
                    <Input
                      value={companyData.email}
                      onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                    />
                  ) : (
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {companyData.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>상세 주소</Label>
                {isEditing ? (
                  <Input
                    value={companyData.detailedAddress}
                    onChange={(e) => setCompanyData({ ...companyData, detailedAddress: e.target.value })}
                  />
                ) : (
                  <p className="text-muted-foreground">{companyData.detailedAddress}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>회사 소개</Label>
                {isEditing ? (
                  <Textarea
                    value={companyData.description}
                    onChange={(e) => setCompanyData({ ...companyData, description: e.target.value })}
                    rows={4}
                    placeholder="회사 소개를 입력하세요..."
                  />
                ) : (
                  <p className="text-muted-foreground leading-relaxed">{companyData.description}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="culture" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>기업 문화</CardTitle>
              <CardDescription>회사의 독특한 문화와 분위기를 소개하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>근무 스타일</Label>
                  {isEditing ? (
                    <Textarea
                      value={companyData.culture.workStyle}
                      onChange={(e) =>
                        setCompanyData({
                          ...companyData,
                          culture: { ...companyData.culture, workStyle: e.target.value },
                        })
                      }
                      rows={3}
                    />
                  ) : (
                    <p className="text-muted-foreground">{companyData.culture.workStyle}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>회사 분위기</Label>
                  {isEditing ? (
                    <Textarea
                      value={companyData.culture.atmosphere}
                      onChange={(e) =>
                        setCompanyData({
                          ...companyData,
                          culture: { ...companyData.culture, atmosphere: e.target.value },
                        })
                      }
                      rows={3}
                    />
                  ) : (
                    <p className="text-muted-foreground">{companyData.culture.atmosphere}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>성장 기회</Label>
                  {isEditing ? (
                    <Textarea
                      value={companyData.culture.growth}
                      onChange={(e) =>
                        setCompanyData({
                          ...companyData,
                          culture: { ...companyData.culture, growth: e.target.value },
                        })
                      }
                      rows={3}
                    />
                  ) : (
                    <p className="text-muted-foreground">{companyData.culture.growth}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>협업 문화</Label>
                  {isEditing ? (
                    <Textarea
                      value={companyData.culture.collaboration}
                      onChange={(e) =>
                        setCompanyData({
                          ...companyData,
                          culture: { ...companyData.culture, collaboration: e.target.value },
                        })
                      }
                      rows={3}
                    />
                  ) : (
                    <p className="text-muted-foreground">{companyData.culture.collaboration}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benefits" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>복리후생</CardTitle>
              <CardDescription>직원들에게 제공하는 다양한 혜택을 관리하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {companyData.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      {getBenefitIcon(benefit.icon)}
                      <div>
                        <span className="font-medium">{benefit.name}</span>
                        <p className="text-xs text-muted-foreground">{benefit.category}</p>
                      </div>
                    </div>
                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBenefit(index)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    placeholder="새 복리후생 추가..."
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addBenefit()}
                  />
                  <Button onClick={addBenefit} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vision" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>비전 및 핵심 가치</CardTitle>
              <CardDescription>회사의 비전, 미션, 핵심 가치를 정의하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>비전 (Vision)</Label>
                  {isEditing ? (
                    <Textarea
                      value={companyData.vision}
                      onChange={(e) => setCompanyData({ ...companyData, vision: e.target.value })}
                      rows={2}
                      placeholder="회사의 비전을 입력하세요..."
                    />
                  ) : (
                    <p className="text-lg font-medium text-[#F4B819]">{companyData.vision}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>미션 (Mission)</Label>
                  {isEditing ? (
                    <Textarea
                      value={companyData.mission}
                      onChange={(e) => setCompanyData({ ...companyData, mission: e.target.value })}
                      rows={2}
                      placeholder="회사의 미션을 입력하세요..."
                    />
                  ) : (
                    <p className="text-lg font-medium text-blue-600">{companyData.mission}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>핵심 가치</Label>
                  <div className="flex flex-wrap gap-2">
                    {companyData.values.map((value, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <Badge variant="outline" className="px-3 py-1">
                          {value}
                        </Badge>
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeValue(index)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  {isEditing && (
                    <div className="flex gap-2 mt-2">
                      <Input
                        placeholder="새 핵심 가치 추가..."
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addValue()}
                      />
                      <Button onClick={addValue} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
