"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, Building2, Loader2 } from "lucide-react"
import { useApi } from "@/hooks/employee_trend/use-api"
import type { JobTrend } from "@/types/employee_trend"


export function CombinedJobTrends() {
  const { data: jobData, loading, error } = useApi<Record<string, JobTrend>>(
    "/api/employee_trend/job-trends"
  )
  const [selectedJob, setSelectedJob] = useState<JobTrend | null>(null);
  useEffect(() => {
    if (jobData && Object.keys(jobData).length > 4) {
      setSelectedJob(jobData['4']); // 4번째 항목 선택
    }
  }, [jobData]);

  if (loading) {
    return (
      <Card className="w-full border-0 shadow-sm">
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full border-0 shadow-sm">
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-destructive">데이터를 불러오는데 실패했습니다: {error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!jobData) {
    return (
      <Card className="w-full border-0 shadow-sm">
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">데이터가 없습니다.</p>
        </CardContent>
      </Card>
    )
  }

  const fixedTopJobs = Object.values(jobData).slice(0, 3)
  const selectedJobData = Object.values(jobData).slice(3)
  if (!selectedJobData) {
    return null
  }

  const handleJobSelect = (job: JobTrend) => {
    setSelectedJob(job)
  }

  const getRankStyle = (index: number) => {
    switch (index) {
      case 0: // 1위 - 금색 (더 은은하게)
        return {
          bg: "bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300",
          border: "border-2 border-amber-300",
          shadow: "shadow-md shadow-amber-100",
          numberBg: "bg-gradient-to-br from-amber-400 to-amber-500",
          textColor: "text-amber-800",
        }
      case 1: // 2위 - 은색 (더 은은하게)
        return {
          bg: "bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300",
          border: "border-2 border-slate-300",
          shadow: "shadow-md shadow-slate-100",
          numberBg: "bg-gradient-to-br from-slate-400 to-slate-500",
          textColor: "text-slate-700",
        }
      case 2: // 3위 - 동색 (더 은은하게)
        return {
          bg: "bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300",
          border: "border-2 border-orange-300",
          shadow: "shadow-md shadow-orange-100",
          numberBg: "bg-gradient-to-br from-orange-400 to-orange-500",
          textColor: "text-orange-800",
        }
      default:
        return {
          bg: "bg-gray-50/80",
          border: "border-gray-200",
          shadow: "",
          numberBg: "bg-gray-400",
          textColor: "text-gray-600",
        }
    }
  }

  return (
    <Card className="w-full border-0 shadow-sm">
      <CardHeader className="pb-6">
        <div className="flex items-center gap-3 mb-3">
          <TrendingUp className="h-6 w-6 text-[#F4B819]" />
          <CardTitle className="text-xl font-bold text-gray-900">📈 인기 직무 트렌드</CardTitle>
        </div>
        <p className="text-base text-gray-600 leading-relaxed">
          최근 3개월 기준 채용 증가율
        </p>
      </CardHeader>

      {/* 금, 은, 동으로 표현한 상위 3개 인기 직무 */}
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {fixedTopJobs.map((job, index) => {
            const rankStyle = getRankStyle(index)
            return (
              <div
                key={job.title}
                className={`flex-1 min-w-0 rounded-xl p-5 space-y-4 transition-all duration-300 hover:scale-105 ${rankStyle.bg} ${rankStyle.border} ${rankStyle.shadow}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full text-white text-sm font-bold flex items-center justify-center shadow-md ${rankStyle.numberBg}`}
                  >
                    {index + 1}
                  </div>
                  <h3 className={`font-semibold text-base ${rankStyle.textColor} truncate`}>{job.title}</h3>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="space-y-2 min-w-0">
                    <div className="flex items-center justify-center">
                      <TrendingUp className={`h-5 w-5 ${rankStyle.textColor}`} />
                    </div>
                    <div className={`text-xl font-bold ${rankStyle.textColor} truncate`}>{job.jobPosts}</div>
                    <div
                      className={`text-xs font-medium ${rankStyle.textColor.replace("800", "600").replace("700", "600")}`}
                    >
                      채용공고
                    </div>
                  </div>
                  <div className="space-y-2 min-w-0">
                    <div className="flex items-center justify-center">
                      <Users className={`h-5 w-5 ${rankStyle.textColor}`} />
                    </div>
                    <div className={`text-xl font-bold ${rankStyle.textColor} truncate`}>{job.applicants}</div>
                    <div
                      className={`text-xs font-medium ${rankStyle.textColor.replace("800", "600").replace("700", "600")}`}
                    >
                      구직자수
                    </div>
                  </div>
                  <div className="space-y-2 min-w-0">
                    <div className="flex items-center justify-center">
                      <Building2 className={`h-5 w-5 ${rankStyle.textColor}`} />
                    </div>
                    <div className={`text-xl font-bold ${rankStyle.textColor} truncate`}>{job.companies}</div>
                    <div
                      className={`text-xs font-medium ${rankStyle.textColor.replace("800", "600").replace("700", "600")}`}
                    >
                      등록기업
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap justify-center min-h-[60px] items-start">
                  {job.skills?.map((skill) => (
                    <Badge
                      key={skill}
                      className={`${rankStyle.textColor} bg-white/70 hover:bg-white/90 text-xs px-3 py-1 font-medium border border-current/20`}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-lg text-gray-900">직무 카테고리</span>
          </div>

          {/* default로 먼저 보여주는 4위 직무 상세 정보 */}
          <div className="bg-gray-50/80 rounded-xl p-6 space-y-5">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#F4B819] text-white text-sm font-bold flex items-center justify-center">
                  {selectedJob?.rank}
                </span>
                <span className="font-semibold text-base text-gray-900">{selectedJob?.title}</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-gray-600">채용공고</span>
                  <span className="font-bold text-[#F4B819] text-base">{selectedJob?.jobPosts}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-600">구직자수</span>
                  <span className="font-bold text-[#F4B819] text-base">{selectedJob?.applicants}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-600">등록기업</span>
                  <span className="font-bold text-[#F4B819] text-base">{selectedJob?.companies}</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-6 gap-3">
                {selectedJobData.map((job) => (
                  <Badge
                    key={job.title}
                    variant={job.title === selectedJob?.title ? "default" : "outline"}
                    className={`cursor-pointer transition-all duration-200 px-3 py-2 text-xs font-medium text-center justify-center ${
                      job.title === selectedJob?.title
                        ? "bg-[#F4B819] hover:bg-[#E5A617] text-white shadow-sm transform scale-105"
                        : "hover:bg-gray-100 border-gray-300 hover:border-[#F4B819]"
                    }`}
                    onClick={() => handleJobSelect(job)}
                  >
                    {job.title}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-900">관련 스킬 (인기순)</h3>
          <div className="flex flex-wrap gap-3">
            {selectedJob?.skills?.map((skill, index) => (
              <Badge
                key={skill}
                variant="outline"
                className={`cursor-pointer transition-all duration-200 px-4 py-2 text-sm font-medium ${
                  index < 2
                    ? "bg-[#F4B819] hover:bg-[#E5A617] text-white border-[#F4B819]"
                    : "hover:bg-gray-100 border-gray-300 hover:border-[#F4B819]"
                }`}
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
