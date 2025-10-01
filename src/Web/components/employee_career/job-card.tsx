import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Building, Users, Clock, Calendar } from "lucide-react"

interface JobCardProps {
  job: {
    id: number
    title: string
    company: string
    location: string
    salary: string
    type: string
    tags: string[]
    matchRate: number
    postedDate: string
    startDate: string
    endDate: string
    companySize: string
    workType: string
    experience: string
    description: string
  }
}

const getDaysUntilDeadline = (endDate: string) => {
  const today = new Date()
  const deadlineDate = new Date(endDate)
  const diffTime = deadlineDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

const getCompanySizeColor = (size: string) => {
  switch (size) {
    case "대기업":
      return "text-blue-600"
    case "중견기업":
      return "text-green-600"
    case "스타트업":
      return "text-purple-600"
    default:
      return "text-gray-600"
  }
}

export function JobCard({ job }: JobCardProps) {
  const daysLeft = getDaysUntilDeadline(job.endDate)

  return (
    <Card className="border border-border hover:border-primary/50 transition-colors">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant={job.matchRate >= 90 ? "default" : "secondary"} className="text-xs">
              매칭률 {job.matchRate}%
            </Badge>
            <div className="flex items-center text-xs">
              <Calendar className="w-3 h-3 mr-1" />
              <span className={daysLeft <= 3 ? "text-red-500 font-medium" : "text-muted-foreground"}>
                {daysLeft > 0 ? `${daysLeft}일 남음` : "접수 종료"}
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm leading-tight mb-1">{job.title}</h4>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-muted-foreground">
                <Building className="w-3 h-3 mr-1" />
                {job.company}
              </div>
              <div className="flex items-center">
                <Users className="w-3 h-3 mr-1" />
                <span className={`text-xs font-medium ${getCompanySizeColor(job.companySize)}`}>{job.companySize}</span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {job.location}
              </div>
              <span className="font-medium">{job.salary}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center text-muted-foreground">
                <Clock className="w-3 h-3 mr-1" />
                {job.workType}
              </div>
              <span className="text-muted-foreground">{job.experience}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">접수기간:</span>
              <span className="font-medium text-primary">
                {job.startDate} ~ {job.endDate}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {job.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs px-2 py-0">
                {tag}
              </Badge>
            ))}
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{job.description}</p>

          <Button size="sm" className="w-full">
            지원하기
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
