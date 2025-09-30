"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"

export function Companies() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>관심 기업</CardTitle>
          <CardDescription>팔로우한 기업의 새로운 채용공고를 확인하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "네이버", industry: "IT/인터넷", employees: "3,000+", newJobs: 5 },
              { name: "카카오", industry: "IT/인터넷", employees: "4,000+", newJobs: 3 },
              { name: "삼성전자", industry: "전자/반도체", employees: "100,000+", newJobs: 12 },
            ].map((company, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{company.name}</h3>
                      <p className="text-sm text-muted-foreground">{company.industry}</p>
                    </div>
                    <Badge variant="secondary">{company.newJobs}개 신규</Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{company.employees} 직원</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
