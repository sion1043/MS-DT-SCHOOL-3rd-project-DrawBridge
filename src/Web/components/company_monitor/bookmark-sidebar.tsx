"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Bookmark,
  BookmarkCheck,
  X,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  DollarSign,
  CheckCircle,
  Send,
} from "lucide-react"
import { SkillAnalysisOverlay } from "./skill-analysis-overlay"
import type { Candidate } from "@/types/company_monitor/candidate"

interface BookmarkSidebarProps {
  bookmarkedCandidates: Candidate[]
  onToggleBookmark: (candidateId: string) => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  onBookmarkedOffer?: () => void
  onClearAllBookmarks?: () => void
}

export function BookmarkSidebar({
  bookmarkedCandidates,
  onToggleBookmark,
  isCollapsed = false,
  onToggleCollapse,
  onBookmarkedOffer,
  onClearAllBookmarks,
}: BookmarkSidebarProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [showSkillAnalysis, setShowSkillAnalysis] = useState<string | null>(null)
  const [showOfferPopup, setShowOfferPopup] = useState<string | null>(null)
  const [isSendingBulkOffer, setIsSendingBulkOffer] = useState(false)

  const handleSendOffer = (candidateId: string, candidateName: string) => {
    console.log("[v0] Send offer to candidate:", candidateId)
    setShowOfferPopup(candidateId)
    setTimeout(() => {
      setShowOfferPopup(null)
    }, 3000)
  }

  const handleSendOfferToAll = () => {
    console.log(
      "[v0] Send offer to all bookmarked candidates:",
      bookmarkedCandidates.map((c) => c.id),
    )
    setIsSendingBulkOffer(true)

    // Simulate sending process
    setTimeout(() => {
      setIsSendingBulkOffer(false)
      if (onBookmarkedOffer) {
        onBookmarkedOffer()
      }
    }, 2500)
  }

  if (isCollapsed) {
    return (
      <div className="w-12 bg-white border-r border-slate-200 flex flex-col items-center py-4 sticky top-0 h-screen">
        <Button variant="ghost" size="sm" onClick={onToggleCollapse} className="mb-4 p-2">
          <ChevronRight className="h-4 w-4" />
        </Button>
        <div className="flex flex-col gap-2">
          {bookmarkedCandidates.slice(0, 5).map((candidate) => (
            <div key={candidate.id} className="relative">
              <Avatar className="h-8 w-8">
                <AvatarImage src={candidate.avatar || candidate.photo} alt={candidate.employee_name} />
                <AvatarFallback className="text-xs">
                  {candidate.employee_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-0.5">
                <BookmarkCheck className="h-2 w-2 text-white" />
              </div>
            </div>
          ))}
          {bookmarkedCandidates.length > 5 && (
            <div className="text-xs text-slate-500 text-center">+{bookmarkedCandidates.length - 5}</div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen relative">
      {isSendingBulkOffer && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-xs">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Send className="h-8 w-8 text-green-600 animate-pulse" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">오퍼 전송 중</h3>
              <p className="text-sm text-gray-600 mb-4">
                북마크된 {bookmarkedCandidates.length}명의 지원자에게
                <br />
                오퍼를 전송하고 있습니다...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bookmark className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-800">북마크</h2>
              <p className="text-xs text-slate-500">{bookmarkedCandidates.length}명 저장됨</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onToggleCollapse} className="p-2">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        {bookmarkedCandidates.length > 0 && (
          <div className="flex gap-2 mt-3">
            <Button
              onClick={handleSendOfferToAll}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              size="sm"
              disabled={isSendingBulkOffer}
            >
              <Send className="h-4 w-4 mr-2" />
              북마크 전체 오퍼 ({bookmarkedCandidates.length}명)
            </Button>
            <Button
              onClick={onClearAllBookmarks}
              variant="outline"
              size="sm"
              className="px-3 hover:bg-red-50 hover:text-red-600 hover:border-red-200 bg-transparent"
              disabled={isSendingBulkOffer}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Bookmarked Candidates */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {bookmarkedCandidates.length === 0 ? (
          <div className="text-center py-8">
            <div className="p-3 bg-slate-100 rounded-full w-fit mx-auto mb-3">
              <Bookmark className="h-6 w-6 text-slate-400" />
            </div>
            <p className="text-sm text-slate-500">북마크된 지원자가 없습니다</p>
            <p className="text-xs text-slate-400 mt-1">관심있는 지원자를 북마크해보세요</p>
          </div>
        ) : (
          bookmarkedCandidates.map((candidate) => (
            <Card
              key={candidate.id}
              className="hover:shadow-md transition-shadow cursor-pointer relative"
              onMouseEnter={() => setHoveredCard(candidate.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <CardContent className="p-3">
                {showOfferPopup === candidate.id && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 rounded-lg">
                    <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">오퍼 전송 완료</h4>
                        <p className="text-xs text-gray-600">{candidate.name}님에게 오퍼를 보냈습니다.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Remove bookmark button */}
                {hoveredCard === candidate.id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 p-1 h-6 w-6 bg-white shadow-sm hover:bg-red-50 hover:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleBookmark(candidate.id)
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}

                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={candidate.avatar || candidate.photo} alt={candidate.employee_name} />
                      <AvatarFallback className="text-sm">
                        {candidate.employee_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                      <BookmarkCheck className="h-2 w-2 text-white" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-sm text-slate-800 truncate">{candidate.employee_name}</h3>
                        <p className="text-xs text-slate-600 truncate">{candidate.job_category_kor}</p>
                      </div>
                      {/* Removed rating display with star icon */}
                    </div>

                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{candidate.education}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{candidate.career}</span>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(candidate.skills_current || []).slice(0, 5).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs px-1.5 py-0.5">
                          {skill}
                        </Badge>
                      ))}
                      {(candidate.skills_current || []).length > 5 && (
                        <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                          +{(candidate.skills_current || []).length - 5}
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-2 mt-3">
                      <div className="relative flex-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full h-7 text-xs bg-transparent"
                          onClick={(e) => {
                            e.stopPropagation()
                            setShowSkillAnalysis(showSkillAnalysis === candidate.id ? null : candidate.id)
                          }}
                        >
                          <BarChart3 className="h-3 w-3 mr-1" />
                          Skill
                        </Button>

                        {showSkillAnalysis === candidate.id && (
                          <div className="absolute top-0 left-full ml-2 z-[9999]">
                            <SkillAnalysisOverlay candidate={candidate} position="right" />
                          </div>
                        )}
                      </div>

                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1 h-7 text-xs bg-green-600 hover:bg-green-700"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSendOffer(candidate.id, candidate.employee_name)
                        }}
                      >
                        <Send className="h-3 w-3 mr-1" />
                        오퍼
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
