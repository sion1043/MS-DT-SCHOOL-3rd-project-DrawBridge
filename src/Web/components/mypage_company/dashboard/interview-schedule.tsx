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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Clock,
  Calendar,
  MapPin,
  Video,
  Plus,
  Edit,
  Trash2,
  Search,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Mail,
  Phone,
  Eye,
} from "lucide-react"
import { useState } from "react"

interface Interview {
  id: number
  candidate: string
  candidateEmail: string
  candidatePhone: string
  position: string
  date: string
  time: string
  duration: number
  type: "online" | "offline"
  location?: string
  meetingLink?: string
  status: "scheduled" | "completed" | "cancelled" | "no-show"
  avatar?: string
  interviewer: string
  notes?: string
  feedback?: string
  rating?: number
}

interface InterviewScheduleProps {
  interviews: Interview[]
}

export function InterviewSchedule({ interviews }: InterviewScheduleProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("upcoming")
  const [newInterview, setNewInterview] = useState({
    candidate: "",
    candidateEmail: "",
    candidatePhone: "",
    position: "",
    date: "",
    time: "",
    duration: 60,
    type: "online" as "online" | "offline",
    location: "",
    meetingLink: "",
    interviewer: "",
    notes: "",
  })

  const enhancedInterviews: Interview[] = interviews.map((interview) => ({
    ...interview,
    candidateEmail: `${interview.candidate.toLowerCase().replace(" ", ".")}@email.com`,
    candidatePhone: "010-1234-5678",
    duration: 60,
    meetingLink: interview.type === "online" ? "https://meet.google.com/abc-defg-hij" : undefined,
    interviewer: "김면접관",
    notes: "기술 면접 진행 예정",
    feedback: interview.status === "completed" ? "기술적 역량이 우수하며 팀워크도 좋음" : undefined,
    rating: interview.status === "completed" ? Math.floor(Math.random() * 5) + 1 : undefined,
  }))

  const filteredInterviews = enhancedInterviews.filter((interview) => {
    const matchesSearch =
      interview.candidate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || interview.status === filterStatus
    const matchesType = filterType === "all" || interview.type === filterType

    const today = new Date()
    const interviewDate = new Date(interview.date)

    let matchesTab = true
    if (activeTab === "upcoming") {
      matchesTab = interviewDate >= today && interview.status === "scheduled"
    } else if (activeTab === "completed") {
      matchesTab = interview.status === "completed"
    } else if (activeTab === "cancelled") {
      matchesTab = interview.status === "cancelled" || interview.status === "no-show"
    }

    return matchesSearch && matchesStatus && matchesType && matchesTab
  })

  const getStatusBadge = (status: string) => {
    const variants = {
      scheduled: { variant: "default" as const, text: "예정", icon: <Clock className="h-3 w-3" /> },
      completed: { variant: "secondary" as const, text: "완료", icon: <CheckCircle className="h-3 w-3" /> },
      cancelled: { variant: "destructive" as const, text: "취소", icon: <XCircle className="h-3 w-3" /> },
      "no-show": { variant: "destructive" as const, text: "불참", icon: <AlertCircle className="h-3 w-3" /> },
    }
    const config = variants[status as keyof typeof variants] || variants.scheduled
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {config.text}
      </Badge>
    )
  }

  const getTypeIcon = (type: string) => {
    return type === "online" ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />
  }

  const groupedInterviews = filteredInterviews.reduce(
    (acc, interview) => {
      const date = interview.date
      if (!acc[date]) acc[date] = []
      acc[date].push(interview)
      return acc
    },
    {} as Record<string, Interview[]>,
  )

  const statusCounts = {
    upcoming: enhancedInterviews.filter((i) => new Date(i.date) >= new Date() && i.status === "scheduled").length,
    completed: enhancedInterviews.filter((i) => i.status === "completed").length,
    cancelled: enhancedInterviews.filter((i) => i.status === "cancelled" || i.status === "no-show").length,
  }

  const handleCreateInterview = () => {
    console.log("Creating new interview:", newInterview)
    setIsCreateDialogOpen(false)
    setNewInterview({
      candidate: "",
      candidateEmail: "",
      candidatePhone: "",
      position: "",
      date: "",
      time: "",
      duration: 60,
      type: "online",
      location: "",
      meetingLink: "",
      interviewer: "",
      notes: "",
    })
  }

  const handleEditInterview = (interview: Interview) => {
    setSelectedInterview(interview)
    setNewInterview({
      candidate: interview.candidate,
      candidateEmail: interview.candidateEmail,
      candidatePhone: interview.candidatePhone,
      position: interview.position,
      date: interview.date,
      time: interview.time,
      duration: interview.duration,
      type: interview.type,
      location: interview.location || "",
      meetingLink: interview.meetingLink || "",
      interviewer: interview.interviewer,
      notes: interview.notes || "",
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateInterview = () => {
    console.log("Updating interview:", selectedInterview?.id, newInterview)
    setIsEditDialogOpen(false)
    setSelectedInterview(null)
  }

  const handleDeleteInterview = (interviewId: number) => {
    if (confirm("정말로 이 면접 일정을 삭제하시겠습니까?")) {
      console.log("Deleting interview:", interviewId)
    }
  }

  const handleViewInterview = (interview: Interview) => {
    setSelectedInterview(interview)
    setIsViewDialogOpen(true)
  }

  const handleStatusChange = (interviewId: number, newStatus: string) => {
    console.log(`Changing status of interview ${interviewId} to ${newStatus}`)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-lg ${i < rating ? "text-yellow-400" : "text-gray-300"}`}>
        ★
      </span>
    ))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                면접 일정 관리
              </CardTitle>
              <CardDescription>예정된 면접 일정을 확인하고 관리하세요</CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#F4B819] hover:bg-[#F4B819]/90 text-black">
                  <Plus className="h-4 w-4 mr-2" />새 면접 일정
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>새 면접 일정 등록</DialogTitle>
                  <DialogDescription>새로운 면접 일정을 등록하세요</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="candidate">지원자 이름</Label>
                      <Input
                        id="candidate"
                        value={newInterview.candidate}
                        onChange={(e) => setNewInterview({ ...newInterview, candidate: e.target.value })}
                        placeholder="지원자 이름"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">지원 포지션</Label>
                      <Input
                        id="position"
                        value={newInterview.position}
                        onChange={(e) => setNewInterview({ ...newInterview, position: e.target.value })}
                        placeholder="예: 프론트엔드 개발자"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">이메일</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newInterview.candidateEmail}
                        onChange={(e) => setNewInterview({ ...newInterview, candidateEmail: e.target.value })}
                        placeholder="candidate@email.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">전화번호</Label>
                      <Input
                        id="phone"
                        value={newInterview.candidatePhone}
                        onChange={(e) => setNewInterview({ ...newInterview, candidatePhone: e.target.value })}
                        placeholder="010-1234-5678"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">면접 날짜</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newInterview.date}
                        onChange={(e) => setNewInterview({ ...newInterview, date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">면접 시간</Label>
                      <Input
                        id="time"
                        type="time"
                        value={newInterview.time}
                        onChange={(e) => setNewInterview({ ...newInterview, time: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">소요 시간 (분)</Label>
                      <Select
                        value={newInterview.duration.toString()}
                        onValueChange={(value) =>
                          setNewInterview({ ...newInterview, duration: Number.parseInt(value) })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30분</SelectItem>
                          <SelectItem value="60">60분</SelectItem>
                          <SelectItem value="90">90분</SelectItem>
                          <SelectItem value="120">120분</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">면접 방식</Label>
                    <Select
                      value={newInterview.type}
                      onValueChange={(value: "online" | "offline") => setNewInterview({ ...newInterview, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online">온라인</SelectItem>
                        <SelectItem value="offline">오프라인</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {newInterview.type === "online" ? (
                    <div className="space-y-2">
                      <Label htmlFor="meetingLink">화상회의 링크</Label>
                      <Input
                        id="meetingLink"
                        value={newInterview.meetingLink}
                        onChange={(e) => setNewInterview({ ...newInterview, meetingLink: e.target.value })}
                        placeholder="https://meet.google.com/..."
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="location">면접 장소</Label>
                      <Input
                        id="location"
                        value={newInterview.location}
                        onChange={(e) => setNewInterview({ ...newInterview, location: e.target.value })}
                        placeholder="예: 본사 2층 회의실"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="interviewer">면접관</Label>
                    <Input
                      id="interviewer"
                      value={newInterview.interviewer}
                      onChange={(e) => setNewInterview({ ...newInterview, interviewer: e.target.value })}
                      placeholder="면접관 이름"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">메모</Label>
                    <Textarea
                      id="notes"
                      value={newInterview.notes}
                      onChange={(e) => setNewInterview({ ...newInterview, notes: e.target.value })}
                      placeholder="면접 관련 메모사항"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    취소
                  </Button>
                  <Button onClick={handleCreateInterview} className="bg-[#F4B819] hover:bg-[#F4B819]/90 text-black">
                    등록
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
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
                <SelectItem value="scheduled">예정</SelectItem>
                <SelectItem value="completed">완료</SelectItem>
                <SelectItem value="cancelled">취소</SelectItem>
                <SelectItem value="no-show">불참</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="방식 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 방식</SelectItem>
                <SelectItem value="online">온라인</SelectItem>
                <SelectItem value="offline">오프라인</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#F4B819]" />
              <div>
                <p className="text-sm text-muted-foreground">예정된 면접</p>
                <p className="text-2xl font-bold">{statusCounts.upcoming}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">완료</p>
                <p className="text-2xl font-bold">{statusCounts.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">온라인</p>
                <p className="text-2xl font-bold">{enhancedInterviews.filter((i) => i.type === "online").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">오프라인</p>
                <p className="text-2xl font-bold">{enhancedInterviews.filter((i) => i.type === "offline").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            예정된 면접 <Badge variant="secondary">{statusCounts.upcoming}</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            완료된 면접 <Badge variant="secondary">{statusCounts.completed}</Badge>
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="flex items-center gap-2">
            취소/불참 <Badge variant="secondary">{statusCounts.cancelled}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {Object.entries(groupedInterviews)
              .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
              .map(([date, dayInterviews]) => (
                <Card key={date}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                      {new Date(date).toLocaleDateString("ko-KR", {
                        month: "long",
                        day: "numeric",
                        weekday: "long",
                      })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-0">
                    {dayInterviews
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map((interview, index) => (
                        <div key={interview.id}>
                          <div className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-4 flex-1">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage src={interview.avatar || "/placeholder.svg"} />
                                  <AvatarFallback>{interview.candidate[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-semibold text-lg">{interview.candidate}</h3>
                                    {getStatusBadge(interview.status)}
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-muted-foreground mb-3">
                                    <div className="flex items-center gap-2">
                                      <Users className="h-4 w-4" />
                                      <span>{interview.position}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Clock className="h-4 w-4" />
                                      <span>
                                        {interview.time} ({interview.duration}분)
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {getTypeIcon(interview.type)}
                                      <span>
                                        {interview.type === "online" ? "온라인" : interview.location || "오프라인"}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Users className="h-4 w-4" />
                                      <span>면접관: {interview.interviewer}</span>
                                    </div>
                                  </div>
                                  {interview.rating && (
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-sm text-muted-foreground">평가:</span>
                                      <div className="flex">{renderStars(interview.rating)}</div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-col gap-2 ml-4">
                                <div className="flex items-center gap-2">
                                  <Select
                                    value={interview.status}
                                    onValueChange={(value) => handleStatusChange(interview.id, value)}
                                  >
                                    <SelectTrigger className="w-[120px] h-8">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="scheduled">예정</SelectItem>
                                      <SelectItem value="completed">완료</SelectItem>
                                      <SelectItem value="cancelled">취소</SelectItem>
                                      <SelectItem value="no-show">불참</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button variant="outline" size="sm" onClick={() => handleViewInterview(interview)}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => handleEditInterview(interview)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteInterview(interview.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                          {index < dayInterviews.length - 1 && <Separator />}
                        </div>
                      ))}
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {Object.keys(groupedInterviews).length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {activeTab === "upcoming" && "예정된 면접이 없습니다"}
              {activeTab === "completed" && "완료된 면접이 없습니다"}
              {activeTab === "cancelled" && "취소된 면접이 없습니다"}
            </h3>
            <p className="text-muted-foreground mb-4">새로운 면접 일정을 추가해보세요</p>
            <Button className="bg-[#F4B819] hover:bg-[#F4B819]/90 text-black">
              <Plus className="h-4 w-4 mr-2" />
              면접 일정 추가
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedInterview?.avatar || "/placeholder.svg"} />
                <AvatarFallback>{selectedInterview?.candidate[0]}</AvatarFallback>
              </Avatar>
              {selectedInterview?.candidate} 면접 정보
            </DialogTitle>
            <DialogDescription>면접 상세 정보</DialogDescription>
          </DialogHeader>
          {selectedInterview && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">지원 포지션</Label>
                  <p>{selectedInterview.position}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">면접 상태</Label>
                  <div className="mt-1">{getStatusBadge(selectedInterview.status)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">면접 날짜</Label>
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(selectedInterview.date).toLocaleDateString("ko-KR")}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">면접 시간</Label>
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {selectedInterview.time} ({selectedInterview.duration}분)
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">이메일</Label>
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {selectedInterview.candidateEmail}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">전화번호</Label>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {selectedInterview.candidatePhone}
                  </p>
                </div>
              </div>
              <Separator />
              <div>
                <Label className="text-sm font-medium text-muted-foreground">면접 방식</Label>
                <p className="flex items-center gap-2 mt-1">
                  {getTypeIcon(selectedInterview.type)}
                  {selectedInterview.type === "online" ? "온라인 면접" : "오프라인 면접"}
                </p>
                {selectedInterview.type === "online" && selectedInterview.meetingLink && (
                  <p className="text-sm text-blue-600 mt-1">{selectedInterview.meetingLink}</p>
                )}
                {selectedInterview.type === "offline" && selectedInterview.location && (
                  <p className="text-sm mt-1">{selectedInterview.location}</p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">면접관</Label>
                <p className="mt-1">{selectedInterview.interviewer}</p>
              </div>
              {selectedInterview.notes && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">메모</Label>
                  <p className="mt-1 p-3 bg-muted rounded-lg text-sm">{selectedInterview.notes}</p>
                </div>
              )}
              {selectedInterview.feedback && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">면접 피드백</Label>
                  <p className="mt-1 p-3 bg-muted rounded-lg text-sm">{selectedInterview.feedback}</p>
                </div>
              )}
              {selectedInterview.rating && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">평가</Label>
                  <div className="flex items-center gap-2 mt-1">{renderStars(selectedInterview.rating)}</div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>면접 일정 수정</DialogTitle>
            <DialogDescription>면접 일정 정보를 수정하세요</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-candidate">지원자 이름</Label>
                <Input
                  id="edit-candidate"
                  value={newInterview.candidate}
                  onChange={(e) => setNewInterview({ ...newInterview, candidate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-position">지원 포지션</Label>
                <Input
                  id="edit-position"
                  value={newInterview.position}
                  onChange={(e) => setNewInterview({ ...newInterview, position: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-date">면접 날짜</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={newInterview.date}
                  onChange={(e) => setNewInterview({ ...newInterview, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-time">면접 시간</Label>
                <Input
                  id="edit-time"
                  type="time"
                  value={newInterview.time}
                  onChange={(e) => setNewInterview({ ...newInterview, time: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-notes">메모</Label>
              <Textarea
                id="edit-notes"
                value={newInterview.notes}
                onChange={(e) => setNewInterview({ ...newInterview, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleUpdateInterview} className="bg-[#F4B819] hover:bg-[#F4B819]/90 text-black">
              수정
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
