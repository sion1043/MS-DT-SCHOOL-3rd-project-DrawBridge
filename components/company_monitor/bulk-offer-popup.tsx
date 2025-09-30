"use client"

import { CheckCircle, Send } from "lucide-react"

interface BulkOfferPopupProps {
  isVisible: boolean
  offerType: "bookmarked" | "all" | null
  count: number
}

export function BulkOfferPopup({ isVisible, offerType, count }: BulkOfferPopupProps) {
  if (!isVisible) return null

  return (
    <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-xs">
        <div className="mb-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Send className="h-8 w-8 text-green-600 animate-pulse" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">오퍼 전송 중</h3>
          <p className="text-sm text-gray-600 mb-4">
            북마크된 ${count}명의 지원자에게
            <br />
            오퍼를 전송하고 있습니다...
          </p>
        </div>
      </div>
    </div>
    // <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    //   <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-3 max-w-md">
    //     <CheckCircle className="h-8 w-8 text-green-500" />
    //     <div>
    //       <h3 className="font-semibold text-gray-900 text-lg">오퍼 전송 완료</h3>
    //       <p className="text-sm text-gray-600">
    //         {offerType === "bookmarked"
    //           ? `북마크된 ${count}명의 지원자에게 오퍼를 보냈습니다.`
    //           : `전체 ${count}명의 지원자에게 오퍼를 보냈습니다.`}
    //       </p>
    //     </div>
    //   </div>
    // </div>
  )
}
