import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { JSX } from "react" // Import JSX to fix the undeclared variable error

interface Job {
  id: number
  title: string
  status: string
  applicants: number
  posted: string
}

interface RecentJobsProps {
  jobs: Job[]
  getStatusBadge: (status: string) => JSX.Element
}

export function RecentJobs({ jobs, getStatusBadge }: RecentJobsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 공고</CardTitle>
        <CardDescription>최근에 등록한 채용 공고들</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{job.title}</p>
                <p className="text-sm text-muted-foreground">지원자 {job.applicants}명</p>
              </div>
              <div className="flex items-center gap-2">{getStatusBadge(job.status)}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
