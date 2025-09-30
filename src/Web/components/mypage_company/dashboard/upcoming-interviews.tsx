import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Interview {
  id: number
  candidate: string
  position: string
  date: string
  time: string
}

interface UpcomingInterviewsProps {
  interviews: Interview[]
}

export function UpcomingInterviews({ interviews }: UpcomingInterviewsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>예정된 면접</CardTitle>
        <CardDescription>이번 주 면접 일정</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {interviews.map((interview) => (
            <div key={interview.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">{interview.candidate}</p>
                <p className="text-sm text-muted-foreground">{interview.position}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{interview.date}</p>
                <p className="text-sm text-muted-foreground">{interview.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
