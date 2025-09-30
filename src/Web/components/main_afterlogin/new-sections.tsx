import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function TrendingJobs() {
  const trendingJobs = [
    { title: "프론트엔드 개발자", count: "1,234개", growth: "+25%" },
    { title: "백엔드 개발자", count: "987개", growth: "+18%" },
    { title: "데이터 분석가", count: "654개", growth: "+32%" },
    { title: "UI/UX 디자이너", count: "432개", growth: "+15%" },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">인기 직무</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {trendingJobs.map((job) => (
            <div key={job.title} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <div>
                <div className="font-medium text-sm">{job.title}</div>
                <div className="text-xs text-muted-foreground">{job.count}</div>
              </div>
              <div className="text-xs text-primary font-medium">{job.growth}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function RecentActivity() {
  const activities = [
    { action: "새 채용공고", company: "테크스타트업", time: "5분 전" },
    { action: "이력서 업데이트", user: "김개발", time: "10분 전" },
    { action: "면접 일정", company: "글로벌IT", time: "15분 전" },
    { action: "지원 완료", user: "박디자인", time: "20분 전" },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">최근 활동</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div key={index} className="flex justify-between items-center p-2 border-l-2 border-primary/20 pl-3">
              <div>
                <div className="font-medium text-sm">{activity.action}</div>
                <div className="text-xs text-muted-foreground">{activity.company || activity.user}</div>
              </div>
              <div className="text-xs text-muted-foreground">{activity.time}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
