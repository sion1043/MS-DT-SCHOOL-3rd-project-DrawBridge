"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Edit } from "lucide-react"

import { Sidebar } from "./dashboard/sidebar"
import { CompanyProfileHeader } from "./dashboard/company-profile-header"
import { CompanyStats } from "./dashboard/company-stats"
import { RecentApplications } from "./dashboard/recent-applications"
import { JobManagement } from "./dashboard/job-management"
import { ApplicantManagement } from "./dashboard/applicant-management"
import { InterviewSchedule } from "./dashboard/interview-schedule"
import { CompanyProfile } from "./dashboard/company-profile"
import { Analytics } from "./dashboard/analytics"
import { getStatusBadge } from "./dashboard/utils"
import { Notifications } from "./dashboard/notifications"
import { CompanyProfileEdit } from "./dashboard/company-profile-edit"

export function CompanyDashboard() {
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditingProfile, setIsEditingProfile] = useState(false)

  // Mock data
  const [companyInfo, setCompanyInfo] = useState({
    name: "테크스타트업",
    industry: "IT 서비스",
    tier: "골드",
    xp: 850,
    email: "hr@techstartup.com",
    phone: "02-1234-5678",
    location: "서울, 대한민국",
    founded: "2020.03.15",
  })

  const stats = {
    totalJobs: 12,
    scheduledInterviews: 3,
    bookmarkedCandidates: 8,
  }

  const [jobs, setJobs] = useState([
    { id: 1, title: "프론트엔드 개발자", status: "active", applicants: 45, posted: "2024-01-15" },
    { id: 2, title: "백엔드 개발자", status: "active", applicants: 32, posted: "2024-01-12" },
    { id: 3, title: "UI/UX 디자이너", status: "inactive", applicants: 28, posted: "2024-01-10" },
    { id: 4, title: "데이터 분석가", status: "active", applicants: 19, posted: "2024-01-08" },
  ])

  const toggleJobStatus = (jobId: number) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === jobId ? { ...job, status: job.status === "active" ? "inactive" : "active" } : job,
      ),
    )
  }

  const handleEditProfile = () => {
    setIsEditingProfile(true)
  }

  const handleSaveProfile = (updatedInfo: any) => {
    setCompanyInfo(updatedInfo)
    setIsEditingProfile(false)
  }

  const handleCancelEdit = () => {
    setIsEditingProfile(false)
  }

  const recentApplications = [
    {
      id: 1,
      title: "네이버 - 프론트엔드 개발자",
      status: "new",
      date: "2024.03.15",
    },
    {
      id: 2,
      title: "카카오 - 백엔드 개발자",
      status: "reviewing",
      date: "2024.03.12",
    },
  ]

  const recentApplicants = [
    {
      id: 1,
      name: "김민수",
      position: "프론트엔드 개발자",
      status: "pending",
      appliedDate: "2024-01-16",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "이지영",
      position: "백엔드 개발자",
      status: "interview",
      appliedDate: "2024-01-15",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "박준호",
      position: "UI/UX 디자이너",
      status: "hired",
      appliedDate: "2024-01-14",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "최수진",
      position: "데이터 분석가",
      status: "rejected",
      appliedDate: "2024-01-13",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const upcomingInterviews = [
    { id: 1, candidate: "김민수", position: "프론트엔드 개발자", date: "2024-01-18", time: "14:00" },
    { id: 2, candidate: "이지영", position: "백엔드 개발자", date: "2024-01-18", time: "16:00" },
    { id: 3, candidate: "정현우", position: "프론트엔드 개발자", date: "2024-01-19", time: "10:00" },
  ]

  return (
    <div className="container mx-auto px-0 py-0">
      {/* 사이드바 + 메인 컨텐츠를 같은 flex 컨테이너로 */}
      <div className="flex gap-6">
        {/* 사이드바는 고정폭 + 줄어들지 않게 */}
        <div className="w-64 shrink-0">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* 메인은 남은 공간을 차지 */}
        <main className="flex-1 min-w-0 space-y-12">
          {/* Main Content */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              {isEditingProfile ? (
                <CompanyProfileEdit
                  companyInfo={companyInfo}
                  onSave={handleSaveProfile}
                  onCancel={handleCancelEdit}
                />
              ) : (
                <>
                  <div className="bg-white rounded-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">프로필 정보</h2>
                      <Button variant="outline" size="sm" onClick={handleEditProfile}>
                        <Edit className="w-4 h-4 mr-2" />
                        편집
                      </Button>
                    </div>
                    <CompanyProfileHeader companyInfo={companyInfo} />
                  </div>

                  <CompanyStats stats={stats} />
                  <RecentApplications applications={recentApplications} />
                </>
              )}
            </div>
          )}

          {activeTab === "jobs" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">공고 관리</h2>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus className="mr-2 h-4 w-4" />새 공고 등록
                </Button>
              </div>
              <JobManagement jobs={jobs} toggleJobStatus={toggleJobStatus} getStatusBadge={getStatusBadge} />
            </div>
          )}

          {activeTab === "applicants" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">지원자 관리</h2>
              <ApplicantManagement applicants={recentApplicants} getStatusBadge={getStatusBadge} />
            </div>
          )}

          {activeTab === "interviews" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">면접 일정</h2>
              <InterviewSchedule interviews={upcomingInterviews} />
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">설정</h2>
              <CompanyProfile />
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">채용 분석</h2>
              <Analytics />
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">알림 설정</h2>
              <Notifications />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}