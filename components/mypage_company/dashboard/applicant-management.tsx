"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Eye,
  Star,
  Search,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  User,
} from "lucide-react"
import { useState } from "react"
import type { JSX } from "react"

interface Applicant {
  id: number
  name: string
  position: string
  status: string
  appliedDate: string
  avatar: string
  email: string
  phone: string
  location: string
  experience: string
  education: string
  skills: string[]
  coverLetter: string
  resumeUrl: string
  rating: number
  notes: string
}

interface ApplicantManagementProps {
  applicants: Applicant[]
  getStatusBadge: (status: string) => JSX.Element
}

export function ApplicantManagement({ applicants, getStatusBadge }: ApplicantManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPosition, setFilterPosition] = useState("all")
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false)
  const [noteText, setNoteText] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const enhancedApplicants: Applicant[] = applicants.map((applicant) => ({
    ...applicant,
    email: `${applicant.name.toLowerCase().replace(" ", ".")}@email.com`,
    phone: "010-1234-5678",
    location: "서울, 강남구",
    experience: "3년",
    education: "컴퓨터공학과 학사",
    skills: ["React", "TypeScript", "Node.js", "Python"],
    coverLetter:
      "안녕하세요. 저는 열정적인 개발자로서 귀사의 비전에 공감하며 함께 성장하고 싶습니다. 다양한 프로젝트 경험을 통해 쌓은 기술력과 팀워크를 바탕으로 회사 발전에 기여하겠습니다.",
    resumeUrl: "/resume.pdf",
    rating: Math.floor(Math.random() * 5) + 1,
    notes: "",
  }))

  const filteredApplicants = enhancedApplicants.filter((applicant) => {
    const matchesSearch =
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || applicant.status === filterStatus
    const matchesPosition = filterPosition === "all" || applicant.position === filterPosition
    const matchesTab = activeTab === "all" || applicant.status === activeTab
    return matchesSearch && matchesStatus && matchesPosition && matchesTab
  })

  const positions = [...new Set(enhancedApplicants.map((applicant) => applicant.position))]

  const statusCounts = {
    all: enhancedApplicants.length,
    pending: enhancedApplicants.filter((a) => a.status === "pending").length,
    reviewing: enhancedApplicants.filter((a) => a.status === "reviewing").length,
    interview: enhancedApplicants.filter((a) => a.status === "interview").length,
    accepted: enhancedApplicants.filter((a) => a.status === "accepted").length,
    rejected: enhancedApplicants.filter((a) => a.status === "rejected").length,
  }

  const handleViewApplicant = (applicant: Applicant) => {
    setSelectedApplicant(applicant)
    setIsViewDialogOpen(true)
  }

  const handleStatusChange = (applicantId: number, newStatus: string) => {
    console.log(`Changing status of applicant ${applicantId} to ${newStatus}`)
  }

  const handleAddNote = (applicant: Applicant) => {
    setSelectedApplicant(applicant)
    setNoteText(applicant.notes)
    setIsNoteDialogOpen(true)
  }

  const handleSaveNote = () => {
    console.log(`Saving note for applicant ${selectedApplicant?.id}: ${noteText}`)
    setIsNoteDialogOpen(false)
    setNoteText("")
  }

  const handleToggleFavorite = (applicantId: number) => {
    console.log(`Toggling favorite for applicant ${applicantId}`)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "reviewing":
        return <Eye className="h-4 w-4" />
      case "interview":
        return <User className="h-4 w-4" />
      case "accepted":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>지원자 관리</CardTitle>
          <CardDescription>모든 지원자의 현황을 확인하고 관리하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="지원자 이름이나 포지션으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="상태 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 상태</SelectItem>
                <SelectItem value="pending">대기중</SelectItem>
                <SelectItem value="reviewing">검토중</SelectItem>
                <SelectItem value="interview">면접</SelectItem>
                <SelectItem value="accepted">합격</SelectItem>
                <SelectItem value="rejected">불합격</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPosition} onValueChange={setFilterPosition}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="포지션 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 포지션</SelectItem>
                {positions.map((position) => (
                  <SelectItem key={position} value={position}>
                    {position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all" className="flex items-center gap-2">
            전체 <Badge variant="secondary">{statusCounts.all}</Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            대기중 <Badge variant="secondary">{statusCounts.pending}</Badge>
          </TabsTrigger>
          <TabsTrigger value="reviewing" className="flex items-center gap-2">
            검토중 <Badge variant="secondary">{statusCounts.reviewing}</Badge>
          </TabsTrigger>
          <TabsTrigger value="interview" className="flex items-center gap-2">
            면접 <Badge variant="secondary">{statusCounts.interview}</Badge>
          </TabsTrigger>
          <TabsTrigger value="accepted" className="flex items-center gap-2">
            합격 <Badge variant="secondary">{statusCounts.accepted}</Badge>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center gap-2">
            불합격 <Badge variant="secondary">{statusCounts.rejected}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardContent className="p-0">
              <div className="space-y-0">
                {filteredApplicants.map((applicant, index) => (
                  <div key={applicant.id}>
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={applicant.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{applicant.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{applicant.name}</h3>
                              {getStatusBadge(applicant.status)}
                              <div className="flex items-center">{renderStars(applicant.rating)}</div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-muted-foreground mb-3">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>{applicant.position}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <span>{applicant.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>{applicant.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>지원일: {applicant.appliedDate}</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {applicant.skills.slice(0, 3).map((skill, skillIndex) => (
                                <Badge key={skillIndex} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {applicant.skills.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{applicant.skills.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          <div className="flex items-center gap-2">
                            <Select
                              value={applicant.status}
                              onValueChange={(value) => handleStatusChange(applicant.id, value)}
                            >
                              <SelectTrigger className="w-[120px] h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">대기중</SelectItem>
                                <SelectItem value="reviewing">검토중</SelectItem>
                                <SelectItem value="interview">면접</SelectItem>
                                <SelectItem value="accepted">합격</SelectItem>
                                <SelectItem value="rejected">불합격</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleViewApplicant(applicant)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleAddNote(applicant)}>
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleFavorite(applicant.id)}
                              className="text-yellow-600 hover:text-yellow-700"
                            >
                              <Star className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {index < filteredApplicants.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedApplicant?.avatar || "/placeholder.svg"} />
                <AvatarFallback>{selectedApplicant?.name[0]}</AvatarFallback>
              </Avatar>
              {selectedApplicant?.name}
            </DialogTitle>
            <DialogDescription>지원자 상세 정보</DialogDescription>
          </DialogHeader>
          {selectedApplicant && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">이메일</Label>
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {selectedApplicant.email}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">전화번호</Label>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {selectedApplicant.phone}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">위치</Label>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {selectedApplicant.location}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">경력</Label>
                  <p>{selectedApplicant.experience}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">학력</Label>
                  <p>{selectedApplicant.education}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">평가</Label>
                  <div className="flex items-center gap-1">{renderStars(selectedApplicant.rating)}</div>
                </div>
              </div>
              <Separator />
              <div>
                <Label className="text-sm font-medium text-muted-foreground">보유 기술</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedApplicant.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">자기소개서</Label>
                <p className="mt-2 p-3 bg-muted rounded-lg text-sm">{selectedApplicant.coverLetter}</p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <FileText className="h-4 w-4" />
                  이력서 다운로드
                </Button>
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Mail className="h-4 w-4" />
                  이메일 보내기
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>메모 추가</DialogTitle>
            <DialogDescription>{selectedApplicant?.name}에 대한 메모를 작성하세요</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="지원자에 대한 메모를 입력하세요..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNoteDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleSaveNote} className="bg-[#F4B819] hover:bg-[#F4B819]/90 text-black">
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
