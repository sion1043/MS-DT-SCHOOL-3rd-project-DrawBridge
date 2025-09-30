import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, TrendingUp, Monitor, Map, Zap } from "lucide-react"
import { ExternalLink } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      {/* bg-primary text-primary-foreground  */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">About Drawbridge</h1>
          <p className="text-xl md:text-2xl mb-8 text-balance max-w-3xl mx-auto opacity-90">
            기업과 구직자를 연결하는 스마트한 채용 플랫폼
          </p>
          <Badge variant="secondary" className="text-lg px-6 py-2">
            사람인 × 점핏 연동
          </Badge>
        </div>
      </section>

      {/* Mission Statement */}
      {/* bg-secondary  */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-secondary-foreground">우리의 미션</h2>
          <p className="text-lg md:text-xl text-secondary-foreground leading-relaxed">
            Drawbridge는 기업과 구직자 사이의{" "}
            <span className="text-primary font-semibold">직접적이고 효율적인 연결</span>을 만들어갑니다. 사람인과 점핏의
            방대한 채용 정보를 활용하여 <span className="text-primary font-semibold">실시간 모니터링</span>과
            <span className="text-primary font-semibold"> 맞춤형 로드맵</span>을 제공하며, 채용 과정의 투명성과 효율성을
            높입니다.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">핵심 서비스</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card text-card-foreground">
              <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <Monitor className="w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">실시간 모니터링</CardTitle>
                <CardDescription className="text-card-foreground/80">
                  사람인과 점핏의 채용공고를 실시간으로 추적하고 분석합니다
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-card-foreground/90">
                  <li>• 새로운 채용공고 알림</li>
                  <li>• 지원 현황 추적</li>
                  <li>• 경쟁률 분석</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card text-card-foreground">
              <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <Map className="w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">맞춤형 로드맵</CardTitle>
                <CardDescription className="text-card-foreground/80">
                  개인별 커리어 목표에 맞는 취업 전략을 제공합니다
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-card-foreground/90">
                  <li>• 스킬 갭 분석</li>
                  <li>• 학습 계획 수립</li>
                  <li>• 포트폴리오 가이드</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card text-card-foreground">
              <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">직접 연결</CardTitle>
                <CardDescription className="text-card-foreground/80">
                  기업과 구직자 간의 직접적인 소통 채널을 제공합니다
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-card-foreground/90">
                  <li>• 1:1 매칭 시스템</li>
                  <li>• 실시간 채팅</li>
                  <li>• 화상 면접 지원</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-secondary-foreground">제휴사</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-card text-card-foreground hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-xl">🤗</span>
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Hugging Face</CardTitle>
                    <CardDescription className="text-card-foreground/80">AI/ML 모델 및 데이터셋 플랫폼</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-card-foreground/90 mb-4">
                  AI 및 머신러닝 분야의 최신 기술과 모델을 활용하여 더 정확한 매칭과 개인화된 추천 서비스를 제공합니다.
                </p>
                <a
                  href="https://huggingface.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-sm font-medium">huggingface.co</span>
                </a>
              </CardContent>
            </Card>

            <Card className="bg-card text-card-foreground hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Map className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">roadmap.sh</CardTitle>
                    <CardDescription className="text-card-foreground/80">개발자 학습 로드맵 플랫폼</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-card-foreground/90 mb-4">
                  체계적인 개발자 학습 로드맵을 제공하여 구직자들이 목표 직무에 필요한 스킬을 단계별로 습득할 수 있도록
                  지원합니다.
                </p>
                <a
                  href="https://roadmap.sh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-sm font-medium">roadmap.sh</span>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* bg-secondary  */}
      <section className="text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-secondary-foreground">연동된 채용공고</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">5,000+</div>
              <div className="text-secondary-foreground">활성 구직자</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1,200+</div>
              <div className="text-secondary-foreground">파트너 기업</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">85%</div>
              <div className="text-secondary-foreground">매칭 성공률</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">사용자 후기</h2>
          <div className="relative">
            <div className="flex animate-scroll gap-6">
              {/* First set of testimonials */}
              <div className="flex-shrink-0 w-80 h-80 bg-card rounded-2xl p-6 flex flex-col justify-between shadow-lg">
                <div>
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <p className="text-base italic mb-6 leading-relaxed">
                    "Drawbridge 덕분에 원하는 회사에 빠르게 취업할 수 있었습니다. 실시간 알림과 맞춤형 로드맵이 정말
                    도움이 되었어요."
                  </p>
                </div>
                <div>
                  <div className="font-semibold text-lg">김민수</div>
                  <div className="text-sm text-muted-foreground">프론트엔드 개발자</div>
                </div>
              </div>

              <div className="flex-shrink-0 w-80 h-80 bg-card rounded-2xl p-6 flex flex-col justify-between shadow-lg">
                <div>
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <p className="text-base italic mb-6 leading-relaxed">
                    "우수한 인재를 빠르게 찾을 수 있어서 채용 프로세스가 훨씬 효율적이 되었습니다. 직접 연결 기능이 특히
                    만족스럽습니다."
                  </p>
                </div>
                <div>
                  <div className="font-semibold text-lg">박지영</div>
                  <div className="text-sm text-muted-foreground">스타트업 HR 매니저</div>
                </div>
              </div>

              <div className="flex-shrink-0 w-80 h-80 bg-card rounded-2xl p-6 flex flex-col justify-between shadow-lg">
                <div>
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                    <Monitor className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <p className="text-base italic mb-6 leading-relaxed">
                    "채용 공고 모니터링 기능이 정말 유용해요. 놓칠 뻔한 좋은 기회들을 많이 발견할 수 있었습니다."
                  </p>
                </div>
                <div>
                  <div className="font-semibold text-lg">이서준</div>
                  <div className="text-sm text-muted-foreground">백엔드 개발자</div>
                </div>
              </div>

              <div className="flex-shrink-0 w-80 h-80 bg-card rounded-2xl p-6 flex flex-col justify-between shadow-lg">
                <div>
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <p className="text-base italic mb-6 leading-relaxed">
                    "로드맵 기능으로 체계적으로 준비할 수 있었고, 면접에서도 자신감을 가질 수 있었습니다."
                  </p>
                </div>
                <div>
                  <div className="font-semibold text-lg">최유진</div>
                  <div className="text-sm text-muted-foreground">UX 디자이너</div>
                </div>
              </div>

              <div className="flex-shrink-0 w-80 h-80 bg-card rounded-2xl p-6 flex flex-col justify-between shadow-lg">

              {/* Second set - exact duplicates for seamless loop */}
              <div>
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                  <Map className="w-6 h-6 text-primary-foreground" />
                </div>
                <p className="text-base italic mb-6 leading-relaxed">
                  "개인 맞춤형 로드맵이 정말 도움이 되었어요. 체계적으로 준비할 수 있어서 좋았습니다."
                </p>
              </div>
              <div>
                <div className="font-semibold text-lg">정현우</div>
                <div className="text-sm text-muted-foreground">데이터 분석가</div>
              </div>
              </div>
              
              {/* Duplicate set for seamless loop */}
              <div className="flex-shrink-0 w-80 h-80 bg-card rounded-2xl p-6 flex flex-col justify-between shadow-lg">
                <div>
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <p className="text-base italic mb-6 leading-relaxed">
                    "Drawbridge 덕분에 원하는 회사에 빠르게 취업할 수 있었습니다. 실시간 알림과 맞춤형 로드맵이 정말
                    도움이 되었어요."
                  </p>
                </div>
                <div>
                  <div className="font-semibold text-lg">김민수</div>
                  <div className="text-sm text-muted-foreground">프론트엔드 개발자</div>
                </div>
              </div>

              <div className="flex-shrink-0 w-80 h-80 bg-card rounded-2xl p-6 flex flex-col justify-between shadow-lg">
                <div>
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <p className="text-base italic mb-6 leading-relaxed">
                    "우수한 인재를 빠르게 찾을 수 있어서 채용 프로세스가 훨씬 효율적이 되었습니다. 직접 연결 기능이 특히
                    만족스럽습니다."
                  </p>
                </div>
                <div>
                  <div className="font-semibold text-lg">박지영</div>
                  <div className="text-sm text-muted-foreground">스타트업 HR 매니저</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card text-card-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-2xl font-bold text-primary mb-4">Drawbridge</div>
          <p className="text-card-foreground/80">더 나은 채용 문화를 만들어가는 연결고리</p>
        </div>
      </footer>
    </div>
  )
}
