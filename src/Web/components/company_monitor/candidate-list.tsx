"use client"

import { CandidateCard } from "./candidate-card"
import type { Candidate } from "@/types/company_monitor/candidate"

interface CandidateListProps {
  candidates: Candidate[]
  onToggleBookmark: (candidateId: string) => void
  unique_company_post_ref: { posting_id: string; posting_title_s: string }[]
}

type Cand = {
  posting_id: string | number;
  posting_title_s: string;
}

export function CandidateList({ candidates, onToggleBookmark }: CandidateListProps) {
  const unique_company_post_ref: { posting_id: string; posting_title_s: string }[] = Array.from(
    (candidates as Cand[]).reduce((map, c) => {
      const pid   = String(c.posting_id);
      const title = String(c.posting_title_s);
      const key   = `${pid}|${title}`;
      if (!map.has(key)) map.set(key, { posting_id: pid, posting_title_s: title });
      return map;
    }, new Map<string, { posting_id: string; posting_title_s: string }>())
    .values()
  );

  return (
    <div className="space-y-4">
      {candidates.map((candidate) => (
        <CandidateCard
          key={candidate.id}
          candidate={candidate}
          onToggleBookmark={onToggleBookmark}
          unique_company_post_ref={unique_company_post_ref}
        />
      ))}
    </div>
  )
}
