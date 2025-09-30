"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"

export function Interviews() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>전체 면접 일정</CardTitle>
          <CardDescription>모든 면접 일정과 이력을 확인하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                company: "카카오",
                position: "풀스택 개발자",
                date: "2024.03.20",
                time: "14:00",
                type: "화상 면접",
                round: "1차 면접",
                status: "예정",
              },
              {
                company: "네이버",
                position: "프론트엔드 개발자",
                date: "2024.03.22",
                time: "10:00",
                type: "대면 면접",
                round: "기술 면접",
                status: "예정",
              },
            ].map((interview, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">
                        {interview.company} - {interview.position}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {interview.round} • {interview.type}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant={interview.status === "예정" ? "default" : "secondary"}>{interview.status}</Badge>
                  <div className="text-right">
                    <p className="font-medium">{interview.date}</p>
                    <p className="text-sm text-muted-foreground">{interview.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
