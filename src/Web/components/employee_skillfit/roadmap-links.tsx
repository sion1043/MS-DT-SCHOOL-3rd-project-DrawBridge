"use client"

import { Button } from "@/components/ui/button"
import { ExternalLink, BookOpen, Code, Database, Cloud } from "lucide-react"

interface RoadmapLinksProps {
  filters: any
}

export function RoadmapLinks({ filters }: RoadmapLinksProps) {
  const roadmaps = [
    {
      title: "Frontend Developer",
      description: "React, Vue, Angular 등 프론트엔드 기술 로드맵",
      icon: Code,
      url: "https://roadmap.sh/frontend",
      color: "text-blue-600",
    },
    {
      title: "Backend Developer",
      description: "Node.js, Python, Java 등 백엔드 기술 로드맵",
      icon: Database,
      url: "https://roadmap.sh/backend",
      color: "text-green-600",
    },
    {
      title: "DevOps Engineer",
      description: "Docker, Kubernetes, AWS 등 DevOps 로드맵",
      icon: Cloud,
      url: "https://roadmap.sh/devops",
      color: "text-purple-600",
    },
    {
      title: "Full Stack Developer",
      description: "풀스택 개발자를 위한 종합 로드맵",
      icon: BookOpen,
      url: "https://roadmap.sh/full-stack",
      color: "text-orange-600",
    },
  ]

  const handleRoadmapClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground mb-4">선택한 기술 스택에 맞는 학습 로드맵을 확인해보세요</p>

      <div className="space-y-2">
        {roadmaps.map((roadmap) => {
          const IconComponent = roadmap.icon
          return (
            <Button
              key={roadmap.title}
              variant="ghost"
              className="w-full justify-start h-auto p-3 text-left"
              onClick={() => handleRoadmapClick(roadmap.url)}
            >
              <div className="flex items-start gap-3 w-full">
                <IconComponent className={`h-5 w-5 mt-0.5 ${roadmap.color}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{roadmap.title}</p>
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{roadmap.description}</p>
                </div>
              </div>
            </Button>
          )
        })}
      </div>

      <div className="mt-4 p-3 bg-primary/10 rounded-lg">
        <p className="text-xs text-muted-foreground">
          🎯 <strong>맞춤 추천:</strong> 현재 필터 조건에 따라 Frontend Developer 로드맵을 추천합니다.
        </p>
      </div>
    </div>
  )
}
