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
import { Eye, Edit, Trash2, Plus, Search, Calendar, MapPin, Users, DollarSign } from "lucide-react"
import { useState } from "react"
import type { JSX } from "react"

interface Job {
  id: number
  title: string
  status: string
  applicants: number
  posted: string
  department: string
  location: string
  salary: string
  type: string
  description: string
  requirements: string[]
  benefits: string[]
  deadline: string
}

interface JobManagementProps {
  jobs: Job[]
  toggleJobStatus: (jobId: number) => void
  getStatusBadge: (status: string) => JSX.Element
}

export function JobManagement({ jobs, toggleJobStatus, getStatusBadge }: JobManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [newJob, setNewJob] = useState({
    title: "",
    department: "",
    location: "",
    salary: "",
    type: "",
    description: "",
    requirements: "",
    benefits: "",
    deadline: "",
  })

  const enhancedJobs: Job[] = jobs.map((job) => ({
    ...job,
    department: job.id === 1 ? "개발팀" : job.id === 2 ? "마케팅팀" : "디자인팀",
    location: "서울, 강남구",
    salary: "3000-5000만원",
    type: "정규직",
    description:
      "우리 회사에서 함께 성장할 인재를 찾습니다. 혁신적인 프로젝트에 참여하여 개인의 역량을 발휘하고 팀과 함께 목표를 달성해보세요.",
    requirements: ["관련 경력 3년 이상", "팀워크 및 커뮤니케이션 능력", "새로운 기술 학습에 대한 열정"],
    benefits: ["4대보험", "연차 15일", "교육비 지원", "점심 제공", "자율 출퇴근"],
    deadline: "2024.12.31",
  }))

  const filteredJobs = enhancedJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || job.status === filterStatus
    const matchesDepartment = filterDepartment === "all" || job.department === filterDepartment
    return matchesSearch && matchesStatus && matchesDepartment
  })

  const departments = [...new Set(enhancedJobs.map((job) => job.department))]

  const handleCreateJob = () => {
    console.log("Creating new job:", newJob)
    setIsCreateDialogOpen(false)
    setNewJob({
      title: "",
      department: "",
      location: "",
      salary: "",
      type: "",
      description: "",
      requirements: "",
      benefits: "",
      deadline: "",
    })
  }

  const handleEditJob = (job: Job) => {
    setSelectedJob(job)
    setNewJob({
      title: job.title,
      department: job.department,
      location: job.location,
      salary: job.salary,
      type: job.type,
      description: job.description,
      requirements: job.requirements.join(", "),
      benefits: job.benefits.join(", "),
      deadline: job.deadline,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateJob = () => {
    console.log("Updating job:", selectedJob?.id, newJob)
    setIsEditDialogOpen(false)
    setSelectedJob(null)
  }

  const handleDeleteJob = (jobId: number) => {
    if (confirm("정말로 이 공고를 삭제하시겠습니까?")) {
      console.log("Deleting job:", jobId)
    }
  }

  const handleViewJob = (job: Job) => {
    setSelectedJob(job)
    setIsViewDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>채용 공고 관리</CardTitle>
              <CardDescription>등록된 모든 채용 공고를 관리하세요</CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#F4B819] hover:bg-[#F4B819]/90 text-black">
                  <Plus className="h-4 w-4 mr-2" />새 공고 등록
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>새 채용 공고 등록</DialogTitle>
                  <DialogDescription>새로운 채용 공고의 상세 정보를 입력하세요</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">공고 제목</Label>
                      <Input
                        id="title"
                        value={newJob.title}
                        onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                        placeholder="예: 프론트엔드 개발자"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">부서</Label>
                      <Select
                        value={newJob.department}
                        onValueChange={(value) => setNewJob({ ...newJob, department: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="부서 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="개발팀">개발팀</SelectItem>
                          <SelectItem value="마케팅팀">마케팅팀</SelectItem>
                          <SelectItem value="디자인팀">디자인팀</SelectItem>
                          <SelectItem value="영업팀">영업팀</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">근무지</Label>
                      <Input
                        id="location"
                        value={newJob.location}
                        onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                        placeholder="예: 서울, 강남구"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salary">급여</Label>
                      <Input
                        id="salary"
                        value={newJob.salary}
                        onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                        placeholder="예: 3000-5000만원"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">고용형태</Label>
                      <Select value={newJob.type} onValueChange={(value) => setNewJob({ ...newJob, type: value })}>
                        <SelectTrigger>
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
                      <Label htmlFor="deadline">마감일</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={newJob.deadline}
                        onChange={(e) => setNewJob({ ...newJob, deadline: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">공고 설명</Label>
                    <Textarea
                      id="description"
                      value={newJob.description}
                      onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                      placeholder="채용 공고에 대한 상세 설명을 입력하세요"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="requirements">자격 요건</Label>
                    <Textarea
                      id="requirements"
                      value={newJob.requirements}
                      onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                      placeholder="필요한 자격 요건을 쉼표로 구분하여 입력하세요"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="benefits">복리혜택</Label>
                    <Textarea
                      id="benefits"
                      value={newJob.benefits}
                      onChange={(e) => setNewJob({ ...newJob, benefits: e.target.value })}
                      placeholder="제공되는 복리혜택을 쉼표로 구분하여 입력하세요"
                      rows={2}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    취소
                  </Button>
                  <Button onClick={handleCreateJob} className="bg-[#F4B819] hover:bg-[#F4B819]/90 text-black">
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
                placeholder="공고 제목이나 부서로 검색..."
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
                <SelectItem value="active">활성</SelectItem>
                <SelectItem value="inactive">비활성</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="부서 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 부서</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="space-y-0">
            {filteredJobs.map((job, index) => (
              <div key={job.id}>
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        {getStatusBadge(job.status)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{job.department}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          <span>{job.salary}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>마감: {job.deadline}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>등록일: {job.posted}</span>
                        <span>지원자: {job.applicants}명</span>
                        <Badge variant="outline">{job.type}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleJobStatus(job.id)}
                        className={
                          job.status === "active"
                            ? "text-red-600 hover:text-red-700 hover:bg-red-50"
                            : "text-green-600 hover:text-green-700 hover:bg-green-50"
                        }
                      >
                        {job.status === "active" ? "비활성화" : "활성화"}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleViewJob(job)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditJob(job)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteJob(job.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                {index < filteredJobs.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedJob?.title}</DialogTitle>
            <DialogDescription>채용 공고 상세 정보</DialogDescription>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">부서</Label>
                  <p>{selectedJob.department}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">근무지</Label>
                  <p>{selectedJob.location}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">급여</Label>
                  <p>{selectedJob.salary}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">고용형태</Label>
                  <p>{selectedJob.type}</p>
                </div>
              </div>
              <Separator />
              <div>
                <Label className="text-sm font-medium text-muted-foreground">공고 설명</Label>
                <p className="mt-1">{selectedJob.description}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">자격 요건</Label>
                <ul className="mt-1 list-disc list-inside space-y-1">
                  {selectedJob.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">복리혜택</Label>
                <ul className="mt-1 list-disc list-inside space-y-1">
                  {selectedJob.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>채용 공고 수정</DialogTitle>
            <DialogDescription>채용 공고 정보를 수정하세요</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">공고 제목</Label>
                <Input
                  id="edit-title"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-department">부서</Label>
                <Select
                  value={newJob.department}
                  onValueChange={(value) => setNewJob({ ...newJob, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="개발팀">개발팀</SelectItem>
                    <SelectItem value="마케팅팀">마케팅팀</SelectItem>
                    <SelectItem value="디자인팀">디자인팀</SelectItem>
                    <SelectItem value="영업팀">영업팀</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">공고 설명</Label>
              <Textarea
                id="edit-description"
                value={newJob.description}
                onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleUpdateJob} className="bg-[#F4B819] hover:bg-[#F4B819]/90 text-black">
              수정
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
