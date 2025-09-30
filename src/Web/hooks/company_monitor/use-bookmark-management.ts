"use client"

import { useState, useCallback } from "react"
import type { Candidate } from "@/types/candidate"

export function useBookmarkManagement() {
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set())

  const toggleBookmark = useCallback((candidateId: string) => {
    setBookmarkedIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(candidateId)) {
        newSet.delete(candidateId)
      } else {
        newSet.add(candidateId)
      }
      return newSet
    })
  }, [])

  const clearAllBookmarks = useCallback(() => {
    setBookmarkedIds(new Set())
  }, [])

  const getBookmarkedCandidates = useCallback(
    (allCandidates: Candidate[]) => {
      return allCandidates
        .filter((candidate) => bookmarkedIds.has(candidate.id))
        .map((candidate) => ({ ...candidate, isBookmarked: true }))
    },
    [bookmarkedIds],
  )

  const isBookmarked = useCallback(
    (candidateId: string) => {
      return bookmarkedIds.has(candidateId)
    },
    [bookmarkedIds],
  )

  return {
    bookmarkedIds,
    toggleBookmark,
    clearAllBookmarks,
    getBookmarkedCandidates,
    isBookmarked,
  }
}
