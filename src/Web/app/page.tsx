import "server-only";
import { HeroBanner } from "@/components/hero-banner"
import { CTASection } from "@/components/cta-section"
import { JobCards } from "@/components/job-cards"

import { FilterSection } from "@/components/main_afterlogin/filter-section"
import { StatsSection } from "@/components/main_afterlogin/stats-section"
import { QuickActions } from "@/components/main_afterlogin/quick-actions"
import { Sidebar } from "@/components/main_afterlogin/sidebar"
import { TrendingJobs, RecentActivity } from "@/components/main_afterlogin/new-sections"
import { getUserFromSession } from "@/lib/session";

import { JumpitCTASection } from "@/components/jumpit_cta_section"
import { JumpitEndComponent } from "@/components/jumpit_endcomponent"

export const dynamic = "force-dynamic"; // 개인화 캐시 방지
export const runtime = "nodejs";

export default async function HomePage() {
  const user = await getUserFromSession();
  const legacy_main = <>
                        {/* 로그인 후 화면 */}
                        <div className="min-h-screen bg-background">
                          <div className="flex">
                            <Sidebar />
                            <main className="flex-1 px-6 py-8">
                              <div className="grid grid-cols-12 gap-8 h-full">

                                {/* 왼쪽: 맞춤 검색 필터 */}
                                <div className="col-span-4">
                                  <FilterSection />
                                </div>

                                {/* 오른쪽: 모든 정보 섹션들 */}
                                <div className="col-span-8 space-y-8">

                                  {/* 상단: 통계 섹션 (4개 박스) */}
                                  <StatsSection />

                                  {/* 중간: 빠른 실행 메뉴와 인기직무를 좌우로 배치 */}
                                  <div className="grid grid-cols-2 gap-8">
                                    <QuickActions />
                                    <TrendingJobs />
                                  </div>

                                  <RecentActivity />
                                </div>
                              </div>
                            </main>
                          </div>
                        </div>
                        
                      </>

  return (    
    <div className="min-h-screen bg-background">
      <main>
        {user ? (
          <>
            {/* 로그인 후 화면 */}
            <JumpitCTASection />
            <JumpitEndComponent />
          </>
        ) : (
          <>
            {/* 로그인 전 화면 */}
            <JumpitCTASection />
            <JumpitEndComponent />
          </>
        )}
      </main>
    </div>
  );
}