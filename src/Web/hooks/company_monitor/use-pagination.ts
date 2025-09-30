"use client"

import { useState, useEffect, useCallback } from "react"
import type { Candidate } from "@/types/candidate"

export function usePagination(filteredCandidates: Candidate[], bookmarkedIds: Set<string>, itemsPerPage = 5) {
  const [displayedCandidates, setDisplayedCandidates] = useState<Candidate[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // Reset pagination when filtered candidates change
  useEffect(() => {
    const initialCandidates = filteredCandidates.slice(0, itemsPerPage)
    setDisplayedCandidates(
      initialCandidates.map((candidate) => ({
        ...candidate,
        isBookmarked: bookmarkedIds.has(candidate.id),
      })),
    )
    setCurrentPage(0)
  }, [filteredCandidates, bookmarkedIds, itemsPerPage])

  const loadMoreCandidates = useCallback(() => {
    if (isLoading) return

    const nextPage = currentPage + 1
    const startIndex = nextPage * itemsPerPage
    const endIndex = startIndex + itemsPerPage

    if (startIndex >= filteredCandidates.length) return

    setIsLoading(true)

    setTimeout(() => {
      const newCandidates = filteredCandidates.slice(startIndex, endIndex)
      setDisplayedCandidates((prev) => [
        ...prev,
        ...newCandidates.map((candidate) => ({
          ...candidate,
          isBookmarked: bookmarkedIds.has(candidate.id),
        })),
      ])
      setCurrentPage(nextPage)
      setIsLoading(false)
    }, 300)
  }, [currentPage, filteredCandidates, isLoading, bookmarkedIds, itemsPerPage])

  // Update bookmark status for displayed candidates
  useEffect(() => {
    setDisplayedCandidates((prev) =>
      prev.map((candidate) => ({
        ...candidate,
        isBookmarked: bookmarkedIds.has(candidate.id),
      })),
    )
  }, [bookmarkedIds])

  return {
    displayedCandidates,
    setDisplayedCandidates,
    loadMoreCandidates,
    isLoading,
    hasMore: displayedCandidates.length < filteredCandidates.length,
  }
}
