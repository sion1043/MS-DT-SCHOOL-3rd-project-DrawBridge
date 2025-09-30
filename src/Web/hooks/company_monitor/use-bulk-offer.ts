"use client"

import { useState, useCallback } from "react"

export function useBulkOffer() {
  const [showBulkOfferPopup, setShowBulkOfferPopup] = useState(false)
  const [bulkOfferType, setBulkOfferType] = useState<"bookmarked" | "all" | null>(null)
  const [bulkOfferCount, setBulkOfferCount] = useState(0)

  const handleBookmarkedOffer = useCallback((count: number) => {
    if (count === 0) return

    setBulkOfferType("bookmarked")
    setBulkOfferCount(count)
    setShowBulkOfferPopup(true)
    setTimeout(() => {
      setShowBulkOfferPopup(false)
      setBulkOfferType(null)
    }, 3000)
  }, [])

  const handleAllOffer = useCallback((count: number) => {
    if (count === 0) return

    setBulkOfferType("all")
    setBulkOfferCount(count)
    setShowBulkOfferPopup(true)
    setTimeout(() => {
      setShowBulkOfferPopup(false)
      setBulkOfferType(null)
    }, 3000)
  }, [])

  return {
    showBulkOfferPopup,
    bulkOfferType,
    bulkOfferCount,
    handleBookmarkedOffer,
    handleAllOffer,
  }
}
