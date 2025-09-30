"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText } from "lucide-react"

export function ResumeManagement() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            이력서 관리
            <Button size="sm">
              <FileText className="mr-2 h-4 w-4" />새 이력서 작성
            </Button>
          </CardTitle>
          <CardDescription>이력서를 작성하고 관리하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { title: "웹 개발자 이력서", updated: "2024.03.15", status: "공개", applications: 8 },
              { title: "풀스택 개발자 이력서", updated: "2024.03.10", status: "비공개", applications: 3 },
            ].map((resume, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-4">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">{resume.title}</h3>
                    <p className="text-sm text-muted-foreground">최종 수정: {resume.updated}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant={resume.status === "공개" ? "default" : "secondary"}>{resume.status}</Badge>
                  <span className="text-sm text-muted-foreground">{resume.applications}회 지원</span>
                  <Button size="sm" variant="outline">
                    편집
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
