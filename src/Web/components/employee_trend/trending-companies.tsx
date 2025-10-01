"use client"

import { Card } from "@/components/ui/card"
import { Search, MessageCircle } from "lucide-react"
import Link from "next/link"

export function TrendingCompanies() {
  return (
    <Card className="bg-gradient-to-r from-green-100 to-green-200 border-green-200 p-4 h-20">
      <Link href="https://jumpit.saramin.co.kr/theme/hitmi">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center">
            <h3 className="text-lg font-semibold text-green-800">
              요즘 폼 미친 기업들            
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="w-12 h-12 bg-green-300 rounded-full flex items-center justify-center">
                <Search className="h-6 w-6 text-green-700" />
              </div>
              <MessageCircle className="absolute -top-1 -right-1 h-5 w-5 text-blue-500 fill-blue-500" />
            </div>
          </div>
        </div>
      </Link>
    </Card>
  )
}
