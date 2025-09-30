import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { JSX } from "react"

interface Applicant {
  id: number
  name: string
  position: string
  status: string
  appliedDate: string
  avatar: string
}

interface RecentApplicantsProps {
  applicants: Applicant[]
  getStatusBadge: (status: string) => JSX.Element
}

export function RecentApplicants({ applicants, getStatusBadge }: RecentApplicantsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 지원자</CardTitle>
        <CardDescription>새로 지원한 후보자들</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {applicants.map((applicant) => (
            <div key={applicant.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={applicant.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{applicant.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{applicant.name}</p>
                  <p className="text-sm text-muted-foreground">{applicant.position}</p>
                </div>
              </div>
              {getStatusBadge(applicant.status)}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
