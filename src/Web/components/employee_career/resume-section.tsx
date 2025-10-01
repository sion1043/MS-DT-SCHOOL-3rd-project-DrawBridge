"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Eye, FileText, Plus } from "lucide-react"
import { useState } from "react"

export function ResumeSection() {
  const [activeResumeId, setActiveResumeId] = useState(1)

  const savedResumes = [
    {
      id: 1,
      title: "프론트엔드 개발자 이력서",
      fileName: "frontend_resume_2024.pdf",
      lastModified: "2024.01.20",
    },
    {
      id: 2,
      title: "풀스택 개발자 이력서",
      fileName: "fullstack_resume_2024.pdf",
      lastModified: "2024.01.15",
    },
    {
      id: 3,
      title: "신입 개발자 이력서",
      fileName: "junior_resume_2024.pdf",
      lastModified: "2024.01.10",
    },
  ]

  const handleResumeClick = (resumeId: number) => {
    setActiveResumeId(resumeId)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">저장된 이력서</CardTitle>
          <Button size="sm" className="bg-[#F4B819] hover:bg-[#F4B819]/90">
            <Plus className="w-4 h-4 mr-2" />새 이력서
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {savedResumes.map((resume) => (
          <div
            key={resume.id}
            onClick={() => handleResumeClick(resume.id)}
            className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${
              resume.id === activeResumeId ? "bg-[#F4B819]/10 border-[#F4B819]/30" : "bg-muted hover:bg-muted/80"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  resume.id === activeResumeId ? "bg-[#F4B819]/20" : "bg-muted-foreground/20"
                }`}
              >
                <FileText
                  className={`w-4 h-4 ${resume.id === activeResumeId ? "text-[#F4B819]" : "text-muted-foreground"}`}
                />
              </div>
              <div>
                <p className="font-medium text-sm">{resume.title}</p>
                <p className="text-xs text-muted-foreground">
                  {resume.fileName} • {resume.lastModified}
                </p>
              </div>
            </div>
            <div className="flex space-x-1">
              <Button variant="ghost" size="sm">
                <Eye className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm">
                <Download className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}

        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            현재 활성:{" "}
            <span className="text-[#F4B819] font-medium">
              {savedResumes.find((r) => r.id === activeResumeId)?.title}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
