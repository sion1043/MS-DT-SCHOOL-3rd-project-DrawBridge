import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const actions = [
  {
    title: "채용공고 등록",
    description: "새로운 인재를 찾고 계신가요?",
    color: "bg-primary text-primary-foreground hover:bg-primary/90",
    href: "/post-job",
  },
  {
    title: "이력서 작성",
    description: "나만의 이력서를 만들어보세요",
    color: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
    href: "/create-resume",
  },
  {
    title: "인재 검색",
    description: "우수한 인재를 찾아보세요",
    color: "bg-accent text-accent-foreground hover:bg-accent/90",
    href: "/search-candidates",
  },
  {
    title: "기업 정보",
    description: "관심 있는 기업을 알아보세요",
    color: "bg-muted text-muted-foreground hover:bg-muted/90",
    href: "/companies",
  },
  {
    title: "취업 가이드",
    description: "취업 준비에 도움이 되는 정보",
    color: "bg-card text-card-foreground border hover:bg-accent",
    href: "/guide",
  },
  {
    title: "커뮤니티",
    description: "다른 사용자들과 소통하세요",
    color: "bg-card text-card-foreground border hover:bg-accent",
    href: "/community",
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">빠른 실행</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => {
            return (
              <Button
                key={action.title}
                variant="ghost"
                className={`h-auto p-4 flex flex-col items-start space-y-2 text-left min-h-[80px] ${action.color}`}
                asChild
              >
                <a href={action.href}>
                  <div className="font-semibold text-sm">{action.title}</div>
                  <div className="text-xs opacity-80 leading-relaxed">{action.description}</div>
                </a>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
