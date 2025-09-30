"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building } from "lucide-react"

export function Applications() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>전체 지원 현황</CardTitle>
          <CardDescription>지원한 모든 채용공고의 상세 내역을 확인하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                company: "네이버",
                position: "프론트엔드 개발자",
                status: "서류 심사 중",
                date: "2024.03.15",
                statusColor: "bg-yellow-500",
                textColor: "text-black",
              },
              {
                company: "카카오",
                position: "풀스택 개발자",
                status: "면접 예정",
                date: "2024.03.12",
                statusColor: "bg-blue-500",
                textColor: "text-white",
              },
              {
                company: "토스",
                position: "백엔드 개발자",
                status: "최종 합격",
                date: "2024.03.10",
                statusColor: "bg-green-500",
                textColor: "text-white",
              },
            ].map((application, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <Building className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <h3 className="font-semibold">{application.company}</h3>
                      <p className="text-sm text-muted-foreground">{application.position}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge className={`${application.statusColor} ${application.textColor}`}>{application.status}</Badge>
                  <span className="text-sm text-muted-foreground">{application.date}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
