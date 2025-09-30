"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  BarChart3,
  Eye,
  Bookmark,
  BookmarkCheck,
  History,
  Briefcase,
  CheckCircle,
  Send,
  User
} from "lucide-react"
import { SkillAnalysisOverlay } from "./skill-analysis-overlay"
import { CandidateProfileModal } from "./candidate-profile-modal"
import type { Candidate } from "@/types/company_monitor/candidate"

interface CandidateCardProps {
  candidate: Candidate
  onToggleBookmark?: (candidateId: string) => void
  unique_company_post_ref: { posting_id: string; posting_title_s: string }[]
}


function sgSort(
  c: string[] = [],
  cl: (number | string)[] = [],
  p: string[] = [],
  pl: (number | string)[] = []
): { techStack: string; curLevel: number; growth: number }[] {
  const pm = new Map<string, number>();
  for (let i = 0; i < p.length; i++) pm.set(p[i], Number(pl[i] ?? 0));

  const o: Record<string, { techStack: string; curLevel: number; growth: number }> = {};
  for (let i = 0; i < c.length; i++) {
    const n = c[i];
    if (!n) continue;
    const cur = Number(cl[i] ?? 0);
    const g = pm.size ? (pm.has(n) ? cur - (pm.get(n) as number) : 0) : 0;
    o[n] = { techStack: n, curLevel: cur, growth: g }; // 같은 스킬명은 마지막 값으로 덮어씀
  }

  return Object.values(o).sort(
    (a, b) => (b.growth - a.growth) || a.techStack.localeCompare(b.techStack)
  );
}


export function CandidateCard({ candidate, onToggleBookmark, unique_company_post_ref }: CandidateCardProps) {
  const [showSkillAnalysis, setShowSkillAnalysis] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showOfferPopup, setShowOfferPopup] = useState(false)

  const handleViewProfile = () => {
    setShowProfileModal(true)
  }

  const handleBookmark = () => {
    if (onToggleBookmark) {
      onToggleBookmark(candidate.id)
    }
  }

  const handleSendOffer = () => {
    console.log(`Sending offer to ${candidate.employee_name}`)
    setShowOfferPopup(true)
    setTimeout(() => {
      setShowOfferPopup(false)
    }, 2000)
  }

  // 기술 스택 보여주기 위한 정보 처리
  const skills_current: string[] = candidate.skills_current || []
  const skills_current_level: number[] = (candidate.skfn_current || []).map(Number)
  const skills_past: string[] = candidate.skills_past || []
  const skills_past_level: number[] = (candidate.skfn_past || []).map(Number)
  const sortedSkillGrowth: { techStack: string; curLevel: number; growth: number; }[] = sgSort(skills_current, skills_current_level, skills_past, skills_past_level)
  console.log("data", "sortedSkillGrowth", sortedSkillGrowth)

  // 기술 스택 평균 계산
  const maxCount = Math.min(sortedSkillGrowth.length, 100)
  const sum = sortedSkillGrowth.reduce((acc, { growth }) => acc + growth, 0);
  const avg = Math.round((sum * 100 / maxCount)) / 100;
  
  // 자사 공고에 지원한 이력만 필터링
  const posting_id_all = candidate.posting_id_all.split(";")
  const last_process = candidate.last_process || []
  const items = posting_id_all.map((id: string, i: number) => ({
    id,
    status: last_process[i] as string | undefined,
  }));
  const filtered = items.flatMap(it => {
    const ref = unique_company_post_ref.find(r => String(r.posting_id) === String(it.id));
    return ref ? [{ title: ref.posting_title_s, status: it.status ?? "" }] : [];
  });


  return (
    <>
      <Card className="hover:shadow-lg transition-shadow relative">
        <CardContent className="p-6">
          {showOfferPopup && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 rounded-lg">
              <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <div>
                  <h3 className="font-semibold text-gray-900">오퍼 전송 완료</h3>
                  <p className="text-sm text-gray-600">{candidate.employee_name}님에게 오퍼를 보냈습니다.</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-12 gap-6">
            {/* Profile Section */}
            <div className="col-span-3 flex flex-col items-center">
              <Avatar className="h-20 w-20 mb-3">
                <AvatarImage src={candidate.avatar || candidate.photo || "/placeholder-user.jpg"} alt={candidate.employee_name} />
                <AvatarFallback className="text-lg">
                  {candidate.employee_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-semibold text-gray-900 text-center">{candidate.employee_name}</h3>
              <p className="text-sm text-gray-600 text-center">{candidate.job_category_kor}</p>
            </div>

            {/* Basic Info Section */}
            <div className="col-span-4 space-y-3">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-1">기본 정보</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{candidate.education}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{candidate.career}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>{candidate.salary || candidate.age + "세 " + candidate.gender}</span>
                  </div>
                </div>
              </div>

              {/* Applied Job Posting */}
              {candidate.posting_id_all && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-1">지원 공고</h4>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-blue-500" />
                    <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">
                      {candidate.posting_title_s}
                    </Badge>
                  </div>
                </div>
              )}
            </div>

            {/* 기술 스택 & 숙련도 계산하는 공간 */}
            {/* Skills & Growth Section */}
            <div className="col-span-3 space-y-3">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-1">기술 스택 & 숙련도</h4>
                <div className="space-y-2">
                  
                  {sortedSkillGrowth?.slice(0, maxCount).map((data, idx) => {
                    return (
                      <div key={data.techStack} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-700">{data.techStack}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600">{data.curLevel}%</span>
                            <span className="text-xs text-green-600 font-medium">+{data.growth}%p</span>
                          </div>
                        </div>
                      </div>
                    )
                  }) || (
                    // Fallback for candidates without detailed proficiency data
                    <div className="flex flex-wrap gap-1.5">
                      {sortedSkillGrowth.slice(0, 6).map((data) => (
                        <Badge key={data.techStack} variant="secondary" className="text-xs">
                          {data.techStack}
                        </Badge>
                      ))}
                      {sortedSkillGrowth.length > 6 && (
                        <Badge variant="outline" className="text-xs">
                          +{sortedSkillGrowth.length - 6}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-green-600 font-medium">평균 {avg || 0}%p 성장률</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="col-span-2 flex flex-col gap-2">
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 bg-transparent w-full justify-start text-xs"
                  onMouseEnter={() => setShowSkillAnalysis(true)}
                  onMouseLeave={() => setShowSkillAnalysis(false)}
                  // onClick={() => setShowSkillAnalysis(v => !v)}
                >
                  <BarChart3 className="h-3 w-3" />
                  분석
                </Button>
                {showSkillAnalysis && <SkillAnalysisOverlay candidate={candidate} position="left" />}
              </div>

              {/* <Button
                size="sm"
                className="flex items-center gap-1 w-full justify-start text-xs"
                onClick={handleViewProfile}
              >
                <Eye className="h-3 w-3" />
                프로필
              </Button> */}

              <Button
                variant="outline"
                size="sm"
                className={`flex items-center gap-1 w-full justify-start transition-colors text-xs ${
                  candidate.isBookmarked ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-transparent"
                }`}
                onClick={handleBookmark}
              >
                {candidate.isBookmarked ? <BookmarkCheck className="h-3 w-3" /> : <Bookmark className="h-3 w-3" />}
                {candidate.isBookmarked ? "저장됨" : "저장"}
              </Button>

              <Button
                size="sm"
                className="flex items-center gap-1 w-full justify-start bg-green-600 hover:bg-green-700 text-white text-xs"
                onClick={handleSendOffer}
              >
                <Send className="h-3 w-3" />
                오퍼
              </Button>
            </div>
          </div>

          {/* Previous Applications Section - Full Width */}
          {filtered && filtered.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-start gap-3">
                <div className="flex items-center gap-1 shrink-0">
                  <History className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">이전 지원 내역</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {filtered.slice(0, 4).map((f, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs">
                        {f.title}
                      </Badge>
                      <Badge
                        variant={
                          f.status === "최종합격" ? "default" :
                          f.status === "불합격" ? "destructive" : "secondary"
                        }
                        className="text-xs px-1.5 py-0.5"
                      >
                        {f.status + " 탈락"}
                      </Badge>
                    </div>
                  ))}
                  {filtered.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{filtered.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <CandidateProfileModal
        candidate={candidate}
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </>
  )
}
