"use client"

import { useState, useEffect, useCallback } from "react"
import { CandidateService, type CandidateFilters } from "@/lib/api/candidates"
import type { Candidate } from "@/data/candidate"

export function useCandidates(initialFilters: CandidateFilters = {}) {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [filters, setFilters] = useState<CandidateFilters>(initialFilters)

  const fetchCandidates = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await CandidateService.getCandidates(filters)
      setCandidates(response.candidates)
      setTotal(response.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch candidates")
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchCandidates()
  }, [fetchCandidates])

  const updateFilters = useCallback((newFilters: Partial<CandidateFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({})
  }, [])

  const toggleBookmark = useCallback(
    async (candidateId: string) => {
      const candidate = candidates.find((c) => c.id === candidateId)
      if (!candidate) return

      try {
        const newBookmarkStatus = !candidate.isBookmarked
        await CandidateService.updateCandidateBookmark(candidateId, newBookmarkStatus)

        setCandidates((prev) => prev.map((c) => (c.id === candidateId ? { ...c, isBookmarked: newBookmarkStatus } : c)))
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update bookmark")
      }
    },
    [candidates],
  )

  return {
    candidates,
    loading,
    error,
    total,
    filters,
    updateFilters,
    resetFilters,
    toggleBookmark,
    refetch: fetchCandidates,
  }
}
