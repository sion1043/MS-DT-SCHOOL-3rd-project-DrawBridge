"use client"

import { useState, useEffect } from "react"
import { FilterSidebar } from "@/components/company_monitor/filter-sidebar"
import { CandidateList } from "@/components/company_monitor/candidate-list"
import { BookmarkSidebar } from "@/components/company_monitor/bookmark-sidebar"
import { BulkOfferPopup } from "@/components/company_monitor/bulk-offer-popup"
import { useFilterState } from "@/hooks/company_monitor/use-filter-state"
import { useCandidateFiltering } from "@/hooks/company_monitor/use-candidate-filtering"
import { usePagination } from "@/hooks/company_monitor/use-pagination"
import { useBookmarkManagement } from "@/hooks/company_monitor/use-bookmark-management"
import { useBulkOffer } from "@/hooks/company_monitor/use-bulk-offer"
import { generateMockCandidates } from "@/utils/company_monitor/candidate-generator"
import type { Candidate } from "@/types/company_monitor/candidate"

export default function HomePage() {
  // const [allCandidates] = useState<Candidate[]>(() => generateMockCandidates())
  const [allCandidates, setAllCandidates] = useState<Candidate[]>([])
  console.log(allCandidates)
  useEffect(() => {
    (async () => {
        const cs = await generateMockCandidates()
        setAllCandidates(cs)
    })().catch(console.error)
  }, []);
  const [isBookmarkSidebarCollapsed, setIsBookmarkSidebarCollapsed] = useState(true)

  const { filters, updateFilter, resetFilters } = useFilterState()
  const filteredAndSortedCandidates = useCandidateFiltering(allCandidates, filters)

  const { bookmarkedIds, toggleBookmark, clearAllBookmarks, getBookmarkedCandidates } = useBookmarkManagement()

  const { displayedCandidates, setDisplayedCandidates, loadMoreCandidates, isLoading, hasMore } = usePagination(
    filteredAndSortedCandidates,
    bookmarkedIds,
  )

  const { showBulkOfferPopup, bulkOfferType, bulkOfferCount, handleBookmarkedOffer, handleAllOffer } = useBulkOffer()

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMoreCandidates()
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [loadMoreCandidates])

  const bookmarkedCandidates = getBookmarkedCandidates(allCandidates)

  const handleToggleBookmark = (candidateId: string) => {
    toggleBookmark(candidateId)
    setDisplayedCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, isBookmarked: !c.isBookmarked } : c)),
    )
  }

  const handleClearAllBookmarks = () => {
    clearAllBookmarks()
    setDisplayedCandidates((prev) => prev.map((c) => ({ ...c, isBookmarked: false })))
  }

  return (
    <div className="min-h-screen bg-background flex">
      <BulkOfferPopup isVisible={showBulkOfferPopup} offerType={bulkOfferType} count={bulkOfferCount} />

      <BookmarkSidebar
        bookmarkedCandidates={bookmarkedCandidates}
        onToggleBookmark={handleToggleBookmark}
        isCollapsed={isBookmarkSidebarCollapsed}
        onToggleCollapse={() => setIsBookmarkSidebarCollapsed(!isBookmarkSidebarCollapsed)}
        onBookmarkedOffer={() => handleBookmarkedOffer(bookmarkedCandidates.length)}
        onClearAllBookmarks={handleClearAllBookmarks}
      />

      <div className="flex-1 flex flex-col">
        <div className="container mx-auto px-55 py-8 space-y-8">
          <div className="mb-6">
            <FilterSidebar
              onFilterChange={updateFilter}
              onResetFilters={resetFilters}
              onSortChange={(sortBy) => updateFilter("sortBy", [sortBy])}
              currentFilters={filters}
              totalCandidates={filteredAndSortedCandidates.length}
            />
          </div>

          <div className="w-full">
            <CandidateList candidates={displayedCandidates} onToggleBookmark={handleToggleBookmark} />

            {isLoading && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}

            {!hasMore && filteredAndSortedCandidates.length > 0 && (
              <div className="text-center py-20 text-muted-foreground">
                모든 지원자를 확인했습니다 ({filteredAndSortedCandidates.length}명)
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
