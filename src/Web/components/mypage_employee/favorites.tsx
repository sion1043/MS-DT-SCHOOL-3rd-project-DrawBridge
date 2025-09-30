"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, MapPin, TrendingUp, Calendar } from "lucide-react"

export function Favorites() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>관심 공고</CardTitle>
          <CardDescription>북마크한 채용공고를 관리하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                company: "삼성전자",
                position: "소프트웨어 엔지니어",
                location: "수원",
                salary: "5000만원~",
                deadline: "2024.04.15",
              },
              {
                company: "LG전자",
                position: "AI 개발자",
                location: "서울",
                salary: "6000만원~",
                deadline: "2024.04.20",
              },
            ].map((job, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{job.company}</h3>
                      <p className="text-muted-foreground">{job.position}</p>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                    </Button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>마감: {job.deadline}</span>
                    </div>
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
