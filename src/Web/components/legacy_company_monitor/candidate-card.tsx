"use client"

import { useState } from "react"
import { MapPin, Star, Bookmark, Mail, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SkillAnalysisOverlay } from "./skill-analysis-overlay"

export interface Candidate {
  id: string
  name: string
  photo: string
  location: string
  skillStack: string[]
  skillLevel: "Intern" | "Junior" | "Mid" | "Senior" | "Lead" | "Principal"
  experience: string
  rating: number
  isBookmarked: boolean
  salaryRange: string
  availability: string
  education: string
}

interface CandidateCardProps {
  candidate: Candidate
  onBookmark: (candidateId: string) => void
  onSendOffer: (candidateName: string) => void
  skillProgressionData?: any
}

export function CandidateCard({ candidate, onBookmark, onSendOffer, skillProgressionData }: CandidateCardProps) {
  const [hoveredCandidateId, setHoveredCandidateId] = useState<string | null>(null)

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case "Senior":
        return "bg-green-100 text-green-800"
      case "Mid":
        return "bg-blue-100 text-blue-800"
      case "Intern":
        return "bg-yellow-100 text-yellow-800"
      case "Lead":
        return "bg-purple-100 text-purple-800"
      case "Principal":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow relative">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-1 flex items-start gap-4">
            <img
              src={candidate.photo || "/placeholder.svg"}
              alt={candidate.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg mb-1">{candidate.name}</h3>
              <div className="flex items-center gap-1 text-muted-foreground mb-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{candidate.location}</span>
              </div>
              <div className="flex items-center gap-1 mb-3">
                <Star className="h-4 w-4 fill-[#F4B819] text-[#F4B819]" />
                <span className="text-sm font-medium">{candidate.rating}</span>
                <span className="text-sm text-muted-foreground">• {candidate.experience}</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-4">
                {candidate.skillStack.map((skill) => (
                  <Badge key={skill} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
              <Badge variant="secondary" className={`text-xs ${getSkillLevelColor(candidate.skillLevel)}`}>
                {candidate.skillLevel} Level
              </Badge>
            </div>
          </div>
          <div
            className="shrink-0 relative"
            onMouseEnter={() => setHoveredCandidateId(candidate.id)}
            onMouseLeave={() => setHoveredCandidateId(null)}
          >
            <Button variant="outline" size="sm" className="shrink-0 bg-transparent">
              <TrendingUp className="h-4 w-4 mr-2" />
              Skill Analysis
            </Button>

            {/* Skill Analysis Overlay */}
            {hoveredCandidateId === candidate.id && skillProgressionData && (
              <SkillAnalysisOverlay candidateData={skillProgressionData} candidateName={candidate.name} />
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBookmark(candidate.id)}
            className={`flex-1 ${candidate.isBookmarked ? "bg-[#F4B819] text-black hover:bg-[#E5A617]" : ""}`}
          >
            <Bookmark className={`h-4 w-4 mr-2 ${candidate.isBookmarked ? "fill-current" : ""}`} />
            {candidate.isBookmarked ? "Saved" : "Save"}
          </Button>
          <Button
            size="sm"
            onClick={() => onSendOffer(candidate.name)}
            className="flex-1 bg-[#F4B819] text-black hover:bg-[#E5A617]"
          >
            <Mail className="h-4 w-4 mr-2" />
            Send Offer
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
