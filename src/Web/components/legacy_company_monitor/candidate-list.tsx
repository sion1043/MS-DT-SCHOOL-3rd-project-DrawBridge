"use client"

import { CandidateCard, type Candidate } from "./candidate-card"

interface CandidateListProps {
  candidates: Candidate[]
  onBookmark: (candidateId: string) => void
  onSendOffer: (candidateName: string) => void
  skillProgressionData: any
}

export function CandidateList({ candidates, onBookmark, onSendOffer, skillProgressionData }: CandidateListProps) {
  return (
    <div className="space-y-4">
      {candidates.map((candidate) => (
        <CandidateCard
          key={candidate.id}
          candidate={candidate}
          onBookmark={onBookmark}
          onSendOffer={onSendOffer}
          skillProgressionData={skillProgressionData[candidate.id]}
        />
      ))}
    </div>
  )
}
