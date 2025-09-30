import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function Sidebar() {
  return (
    <aside className="w-80 bg-card border-r min-h-screen p-6">
      <div className="space-y-6">
        {/* 빠른 메뉴 */}
        <Card className="p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <span className="text-primary">📈</span>
            빠른 메뉴
          </h3>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" size="sm">
              <span className="mr-2">💼</span>내 지원현황
            </Button>
            <Button variant="ghost" className="w-full justify-start" size="sm">
              <span className="mr-2">❤️</span>
              관심기업
            </Button>
            <Button variant="ghost" className="w-full justify-start" size="sm">
              <span className="mr-2">⭐</span>
              스크랩한 공고
            </Button>
            <Button variant="ghost" className="w-full justify-start" size="sm">
              <span className="mr-2">🕒</span>
              최근 본 공고
            </Button>
          </div>
        </Card>

        {/* 인기 직무 */}
        <Card className="p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <span className="text-primary">👥</span>
            인기 직무
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">프론트엔드 개발자</span>
              <Badge variant="secondary" className="text-xs">
                1,234
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">백엔드 개발자</span>
              <Badge variant="secondary" className="text-xs">
                987
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">데이터 분석가</span>
              <Badge variant="secondary" className="text-xs">
                756
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">UI/UX 디자이너</span>
              <Badge variant="secondary" className="text-xs">
                543
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">프로젝트 매니저</span>
              <Badge variant="secondary" className="text-xs">
                432
              </Badge>
            </div>
          </div>
        </Card>

        {/* 추천 기업 */}
        <Card className="p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <span className="text-primary">🏢</span>
            추천 기업
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-xs font-bold text-blue-600">N</span>
              </div>
              <div>
                <div className="text-sm font-medium">네이버</div>
                <div className="text-xs text-muted-foreground">IT·인터넷</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-xs font-bold text-green-600">K</span>
              </div>
              <div>
                <div className="text-sm font-medium">카카오</div>
                <div className="text-xs text-muted-foreground">IT·인터넷</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-xs font-bold text-red-600">L</span>
              </div>
              <div>
                <div className="text-sm font-medium">라인</div>
                <div className="text-xs text-muted-foreground">IT·인터넷</div>
              </div>
            </div>
          </div>
        </Card>

        {/* 커리어 가이드 */}
        <Card className="p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <span className="text-primary">📚</span>
            커리어 가이드
          </h3>
          <div className="space-y-2">
            <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
              면접 준비 가이드
            </a>
            <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
              이력서 작성 팁
            </a>
            <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
              연봉 협상 노하우
            </a>
            <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
              직무별 스킬 가이드
            </a>
          </div>
        </Card>
      </div>
    </aside>
  )
}
