import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const stats = [
  {
    title: "전체 채용공고",
    value: "12,345",
    change: "+15%",
    description: "이번 달 신규 공고",
  },
  {
    title: "활성 구직자",
    value: "45,678",
    change: "+8%",
    description: "월간 활성 사용자",
  },
  {
    title: "등록 기업",
    value: "3,456",
    change: "+12%",
    description: "검증된 기업",
  },
  {
    title: "성공 매칭",
    value: "8,901",
    change: "+22%",
    description: "이번 달 성사",
  },
]

export function StatsSection() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => {
          return (
            <Card key={stat.title} className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">{stat.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="flex flex-col space-y-1 text-xs text-muted-foreground">
                  <span className="text-primary font-medium">{stat.change}</span>
                  <span>{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
